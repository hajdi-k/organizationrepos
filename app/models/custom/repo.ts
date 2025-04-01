import { tracked } from '@glimmer/tracking';

import type { Languages, Repo as RepoObj } from 'key/types/github';

export type LanguagesType = Languages | null | undefined;

export class Repo {
  id;
  name;
  htmlUrl;
  stargazersCount;
  isPrivate;
  organizationName;
  @tracked branches: string[] | null | undefined = undefined;
  @tracked languages: LanguagesType = undefined;
  @tracked requestedBy;

  constructor(repo: RepoObj, organizationName: string, requestedBy: string) {
    this.id = repo.id;
    this.name = repo.name;
    this.htmlUrl = repo.html_url;
    this.stargazersCount = repo.stargazers_count;
    this.isPrivate = repo.private;
    this.organizationName = organizationName;
    this.requestedBy = new Set();
    this.requestedBy.add(requestedBy);
  }

  get mostPopularLanguage(): string | null {
    const languages = this.languages || {};
    if (!languages) {
      return '';
    }

    const sortedLanguages = Object.entries(languages).sort(
      ([, a], [, b]) => b - a
    );
    return sortedLanguages.length > 0 ? (sortedLanguages[0]?.[0] ?? '') : '';
  }

  get languagesArray(): string[] | null {
    return this.languages ? Object.keys(this.languages) : [];
  }

  addToRequestedBy(requestedBy: string) {
    this.requestedBy.add(requestedBy);
  }

  removeFromRequestedBy(requestedBy: string) {
    this.requestedBy.delete(requestedBy);
  }
}
