import Component from '@glimmer/component';

import type { LanguagesType } from 'key/models/custom/repo';

interface LanguageUsageObj {
  language: string;
  percentage: number;
}
interface LanguageUsageArgs {
  languages: LanguagesType;
}

interface ReposListLanguageUsageComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}

export default class ReposListLanguageUsageComponent extends Component<
  ReposListLanguageUsageComponentInterface<LanguageUsageArgs>
> {
  languagePercentages: LanguageUsageObj[] = [];

  constructor(owner: unknown, args: LanguageUsageArgs) {
    super(owner, args);
    this.calculatePercentages();
  }

  calculatePercentages() {
    const { languages } = this.args || {};

    if (!languages) {
      return [];
    }

    const total = Object.values(languages).reduce(
      (sum, value) => sum + value,
      0
    );

    this.languagePercentages = Object.entries(languages).map(
      ([language, value]) => ({
        language,
        percentage: parseFloat(((value / total) * 100).toFixed(2)),
      })
    );
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Repos::List::LanguageUsage': typeof ReposListLanguageUsageComponent;
  }
}
