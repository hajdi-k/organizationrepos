import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type CustomSessionService from 'key/services/session';

interface Args {
  onOrganizationNameChange: (value: string) => void;
  onTokenChange: (value: string) => void;
}

interface ReposSearchComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}

export default class ReposSearchComponent extends Component<
  ReposSearchComponentInterface<Args>
> {
  @service('session') declare sessionService: CustomSessionService;

  @tracked organizationName = '';

  token = '';

  get tokens() {
    return this.sessionService.tokens;
  }

  @action
  isSelectedToken(tokenId: string) {
    return tokenId === this.token;
  }

  @action
  handleOrganizationNameChange(value: string) {
    this.organizationName = value;
    this.args.onOrganizationNameChange(this.organizationName);
  }

  @action
  handleTokenChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.token = target?.value.trim() ?? '';
    this.args.onTokenChange(this.token);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Repos::Search': typeof ReposSearchComponent;
  }
}
