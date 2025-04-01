import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import type SessionService from 'key/services/session';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Args {}
interface TokensIndexComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}

export default class TokensIndexComponent extends Component<
  TokensIndexComponentInterface<Args>
> {
  @service('session') declare sessionService: SessionService;
  isInvalidating: boolean = false;

  get tokens() {
    return this.sessionService.tokens;
  }

  @action
  async invalidateToken(tokenToRemove: string) {
    this.isInvalidating = true;
    try {
      await this.sessionService.invalidateToken(tokenToRemove);
    } catch (error) {
      console.error('Could not remove token', error);
    } finally {
      this.isInvalidating = false;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Tokens: typeof TokensIndexComponent;
  }
}
