import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

import { promiseSequence } from 'key/utils/github';

import { Repo } from 'key/models/custom/repo';

import type { TokenData } from 'key/types/auth';
import type { Branch, GetRepoResponse, Languages } from 'key/types/github';

type RequestPromiseCache = {
  [key: string]: Promise<Repo[]>;
};

export default class GithubService extends Service {
  BASE_URL = 'https://api.github.com';

  organizationRequests: RequestPromiseCache = {};
  @tracked repos: Repo[] = [];

  fetchRepos(
    token: TokenData | null,
    organizationName: string,
    useCache = true
  ) {
    if (!organizationName || !token) {
      return Promise.reject(new Error('Missing organization name or token'));
    }

    const key = `${token.id}__${organizationName}_${token.user.login}`,
      encodedKey = btoa(key),
      cachedPromise = this.organizationRequests[encodedKey];

    if (cachedPromise && useCache) {
      return cachedPromise;
    } else {
      const promise = new Promise<Repo[]>((resolve, reject) => {
        this.fetch(`${this.BASE_URL}/orgs/${organizationName}/repos`, token.id)
          .then((data: GetRepoResponse) => {
            try {
              this.storeRepos(
                token.id,
                data,
                organizationName,
                token.user.login
              );
            } catch (error) {
              console.error('An error occurred:', error);
            }
            resolve(this.repos);
          })
          .catch((error: Error) => {
            reject(error);
          })
          .finally(() => {
            // Ensure the cache is updated regardless of success or failure. To retry the request after failiure, provide useCache true.
            this.organizationRequests[encodedKey] = promise;
          });
      });

      return promise;
    }
  }

  storeRepos(
    token: string,
    newRepoObjects: GetRepoResponse,
    organizationName: string,
    requestedBy: string
  ) {
    const oldRepos = this.repos,
      idMap = new Map(oldRepos.map((repo, index) => [repo.id, index])),
      repos = [...oldRepos],
      requestQueue: { repoName: string; urls: string[] }[] = [];

    newRepoObjects.forEach((newRepoObject) => {
      const oldIndex = idMap.get(newRepoObject.id);
      if (oldIndex === undefined) {
        repos.push(new Repo(newRepoObject, organizationName, requestedBy));
        requestQueue.push({
          repoName: newRepoObject.name,
          urls: [
            `${this.BASE_URL}/repos/${organizationName}/${newRepoObject.name}/branches`,
            `${this.BASE_URL}/repos/${organizationName}/${newRepoObject.name}/languages`,
          ],
        });
      } else {
        oldRepos[oldIndex]?.addToRequestedBy(requestedBy);
      }
    });

    const batchSize = 1;

    const processBatch = async (
      batch: { repoName: string; urls: string[] }[]
    ) => {
      await promiseSequence(
        batch.flatMap((item) => item.urls.map((url) => [url, token])),
        (url: string, token: string) => this.fetch(url, token)
      )
        .then((result) => {
          result.results.forEach((data, index) => {
            const repoIndex = Math.floor(index / 2);
            const repoName = batch[repoIndex]?.repoName;
            const repo = repos.find((r) => r.name === repoName);
            if (repo) {
              if (index % 2 === 0) {
                repo.branches = data
                  ? (data as Branch[]).map((b) => b.name)
                  : null;
              } else {
                repo.languages = data ? (data as Languages) : null;
              }
            }
          });
        })
        .catch(() => {});
    };

    const processQueue = async () => {
      for (let i = 0; i < requestQueue.length; i += batchSize) {
        const batch = requestQueue.slice(i, i + batchSize);
        await processBatch(batch);
      }
    };

    processQueue().catch(() => {});

    this.repos = repos;
  }

  fetch(url: string, token: string) {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
  }
}
