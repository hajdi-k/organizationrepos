import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type GithubService from 'key/services/github';
import type SessionService from 'key/services/session';
import type UiHelperService from 'key/services/ui-helper';

import type { TokenData } from 'key/types/auth';

export interface LanguageOption {
  value: string;
  activeClass: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Args {}

interface ReposExplorerComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}
export default class ReposExplorerComponent extends Component<
  ReposExplorerComponentInterface<Args>
> {
  @service('session') declare sessionService: SessionService;
  @service('ui-helper') declare uiHelperService: UiHelperService;
  @service('github') declare githubService: GithubService;

  @tracked organizationName = '';
  @tracked token: TokenData | null;
  @tracked isLoading = false;
  @tracked errorMessage: string | null = null;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.token = this.sessionService.tokens[0] || null;
  }

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }

  get tokenUserLogin() {
    return this.token?.user.login ?? '';
  }

  get allRepos() {
    const results = this.githubService.repos.filter((repo) => {
      return (
        repo.requestedBy.has(this.tokenUserLogin) &&
        repo.organizationName === this.organizationName
      );
    });
    return results;
  }

  @action
  handleTokenChange(value: string) {
    this.token =
      this.sessionService.tokens.find((tokenData) => {
        return tokenData.id === value;
      }) ?? null;

    this.search();
  }

  @action
  handleOrganizationNameChange(value: string) {
    this.organizationName = value;
    this.isLoading = true;
    this.errorMessage = null;
    this.debouncedSearch();
  }

  debouncedSearch() {
    // eslint-disable-next-line ember/no-runloop, @typescript-eslint/unbound-method
    debounce(this, this.search, 1000);
  }

  @action
  search() {
    if (this.isAuthenticated && this.organizationName) {
      this.isLoading = true;
      this.errorMessage = null;
      this.githubService
        .fetchRepos(this.token, this.organizationName)
        .catch(() => {
          this.errorMessage = 'Failed to fetch repositories. Please try again.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000);
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }
}
declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Repos::Explorer': typeof ReposExplorerComponent;
  }
}
