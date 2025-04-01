/* eslint-disable */
import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { Server, Model } from "miragejs";
import { promiseSequence } from "key/utils/github";
import type { Branch } from "key/types/github";

const LANGUAGES = {
  TypeScript: 32861,
  Handlebars: 16395,
  JavaScript: 6031,
  HTML: 1897,
  CSS: 10,
};

const inputs = [
  ["/api/repos/${organization}/${repository1}/languages", "ABC"],
  ["/api/repos/${organization}/${repository1}/branches", "ABC"],
  ["/api/repos/${organization}/${repository2}/languages", "ABC"],
  ["/api/repos/${organization}/${repository2}/branches", "ABC"],
];

async function githubFetch(url: string, token: string) {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

module("Unit | Utility | fetch-data", function (hooks) {
  /*
    hooks.beforeEach and hooks.afterEach are used to set up and shut down the mock server before and after each test
  */
  setupTest(hooks);

  let server: Server;

  hooks.beforeEach(function () {
    server = new Server({
      models: {
        branch: Model,
      },

      seeds(server) {
        server.create("branch", { id: "main", name: "main" });
        server.create("branch", { id: "develop", name: "develop" });
      },

      routes() {
        this.namespace = "api";

        this.get(
          "/repos/:organization/:repository/branches",
          (schema: any) => {
            // return schema.branches.all();
            return schema.branches.all().models;
          }
        );

        this.get(
          "/repos/:organization/:repository/languages",
          (schema, request) => {
            return LANGUAGES;
          }
        );
      },
    });
  });

  hooks.afterEach(function () {
    server.shutdown();
  });

  test("it fetches languages correctly", async function (assert) {
    const url = "/api/repos/${organization}/${repository}/languages";
    const result = await githubFetch(url, "ABC");

    assert.deepEqual(result, LANGUAGES);
  });

  test("it fetches branches correctly", async function (assert) {
    const url = "/api/repos/${organization}/${repository}/branches";
    const result = await githubFetch(url, "ABC");
    const branches = result.map((b:Branch)  => b.name);

    assert.deepEqual(branches, ['main', 'develop']);
  });
});
/* eslint-enable */
