import SimpleAuthSessionService from 'ember-simple-auth/services/session';

import { Authenticator } from 'key/authenticators/github-pat';
import type { AuthenticatorType } from 'key/authenticators/github-pat';
import type { TokenData } from 'key/types/auth';

type Data = {
  authenticated: {
    authenticator: AuthenticatorType;
    tokens: TokenData[];
  };
};

export default class CustomSessionService extends SimpleAuthSessionService<Data> {
  authenticator = Authenticator;

  get tokens() {
    return this.data.authenticated.tokens || [];
  }

  updateTokens(tokens: TokenData[], errorHandler?: (error: string) => void) {
    return new Promise((resolve, reject) => {
      if (tokens.length) {
        this.authenticate(this.authenticator, '', tokens, errorHandler)
          .then(resolve)
          .catch(reject);
      } else {
        this.invalidate();
        resolve('done');
      }
    });
  }

  async invalidateToken(tokenToRemove: string) {
    const authenticatedData = this.data.authenticated,
      tokens = authenticatedData.tokens || [],
      updatedTokens = tokens.filter(({ id }) => id !== tokenToRemove);

    await this.updateTokens(updatedTokens);
  }

  async addToken(newToken: string, errorHandler?: (error: string) => void) {
    const tokens = this.tokens;
    return this.authenticate(Authenticator, newToken, tokens, errorHandler);
  }
}
