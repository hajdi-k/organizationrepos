import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { sortNumAsc, sortNumDesc } from 'key/utils/github';

import type { LanguageOption } from 'key/components/repos/explorer';

import type { Repo } from 'key/models/custom/repo';

export const enum Privacy {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
  ALL = 'All',
}

const enum SortOrder {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

interface Args {
  allRepos: Repo[];
}

interface ReposListFilterSortComponentInterface<T> {
  Args: T;
  Blocks: { default: [Repo[]] }; // this is needed for yield
}

export default class ReposListFilterSortComponent extends Component<
  ReposListFilterSortComponentInterface<Args>
> {
  classForPrivateFilter =
    'px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-sky-100';
  filter: FilterModel;
  sort: SortModel;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.filter = new FilterModel();
    this.sort = new SortModel();
  }

  get privacyOptions() {
    return [Privacy.ALL, Privacy.PUBLIC, Privacy.PRIVATE].map((o) => ({
      value: o,
      activeClass: o === this.filter.privacy ? '!bg-sky-200' : '',
    }));
  }

  get languageOptions(): LanguageOption[] {
    let allLanguages = this.visibleRepos.flatMap((repo) =>
      repo.languages ? Object.keys(repo.languages) : []
    );

    const languageSet = new Set(allLanguages);

    allLanguages =
      this.filter.language === 'All' || languageSet.has(this.filter.language)
        ? [...languageSet]
        : [this.filter.language, ...languageSet];

    return ['All', ...allLanguages].map((language) => ({
      value: language,
      activeClass: language === this.filter.language ? '!bg-sky-200' : '',
    }));
  }

  get showLanguageOptions() {
    return this.languageOptions.length > 1;
  }

  get sortOptions() {
    return [
      { id: 'index', name: 'Default' },
      { id: 'stargazersCount', name: 'Stargazers Count' },
    ];
  }

  get sortOrderOptions() {
    return [SortOrder.ASCENDING, SortOrder.DESCENDING];
  }

  get isRepoDataIncomplete() {
    return this.args.allRepos.some(
      (repo) => repo.languages === undefined || repo.branches === undefined
    );
  }

  get visibleRepos() {
    let filteredAndSorted = this.args.allRepos.filter((repo) => {
      if (this.filter.privacy === Privacy.PUBLIC) {
        return !repo.isPrivate;
      } else if (this.filter.privacy === Privacy.PRIVATE) {
        return repo.isPrivate;
      }

      return true;
    });

    filteredAndSorted = filteredAndSorted.filter((repo) =>
      this.filter.language === 'All'
        ? true
        : repo.languagesArray?.some((l) => l === this.filter.language)
    );

    const isSortOrderAsc = this.sort.sortOrder === SortOrder.ASCENDING,
      sort = isSortOrderAsc ? sortNumAsc : sortNumDesc;

    if (this.sort.sortProp === 'stargazersCount') {
      filteredAndSorted.sort((repo1, repo2) => {
        return sort(repo1.stargazersCount, repo2.stargazersCount);
      });
    } else if (this.sort.sortProp === 'index' && !isSortOrderAsc) {
      filteredAndSorted.reverse();
    }

    return filteredAndSorted;
  }

  @action
  changePrivacyFilter(value: Privacy) {
    this.filter.privacy = value;
  }

  @action
  changeLanguageFilter(value: string) {
    this.filter.language = value;
  }

  @action
  isSelectedSortOption(optionId: string) {
    return optionId === this.sort.sortProp;
  }

  @action
  handleSortOptionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.sort.sortProp = target?.value.trim() ?? '';
  }
}

export class FilterModel {
  @tracked language: string;
  @tracked privacy: Privacy;

  constructor() {
    this.privacy = Privacy.ALL;
    this.language = 'All';
  }
}

export class SortModel {
  @tracked sortProp: string;
  @tracked sortOrder: SortOrder;

  constructor() {
    this.sortProp = 'index';
    this.sortOrder = SortOrder.ASCENDING;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Repos::List::FilterSort': typeof ReposListFilterSortComponent;
  }
}
