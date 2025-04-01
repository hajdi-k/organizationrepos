import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { RouteName } from 'key/components/nav';

import type SessionService from 'key/services/session';

import { Authenticator } from 'key/authenticators/github-pat';

interface Args {
  heading: string;
  info: string;
  maxInputWidth?: string;
  showCtaInstead?: boolean;
}

interface TokensAddComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}

export default class TokensAddComponent extends Component<
  TokensAddComponentInterface<Args>
> {
  @service('session') declare sessionService: SessionService;
  linkTo: string;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.linkTo = RouteName.ADD_TOKEN;
  }

  @tracked token = '';
  @tracked errorMessage = '';
  @tracked isLoading = false;

  get maxInputWidth() {
    return this.args.maxInputWidth ?? '';
  }

  @action
  handleTokenChange(value: string) {
    this.token = value;
  }

  @action
  addToken(event: Event) {
    event.preventDefault();
    this.isLoading = true;

    const handleSuccess = () => {
      this.token = '';
      this.isLoading = false;
      (document.getElementById('token') as HTMLInputElement).value = ''; // Clear the input value
    };

    const handleError = (error: string) => {
      this.errorMessage = error || 'Failed to add token. Please try again.';
      this.isLoading = false;
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    };

    const request = this.sessionService.tokens.length
      ? this.sessionService.addToken(this.token, handleError)
      : this.sessionService.authenticate(
          Authenticator,
          this.token,
          [],
          handleError
        );

    request
      .then(handleSuccess)
      .catch(() => handleError('Failed to add token. Please try again.'));
  }
}
declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Tokens::Add': typeof TokensAddComponent;
  }
}
