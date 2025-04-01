import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';

import Base from 'ember-simple-auth/authenticators/base';
import { Promise } from 'rsvp';

import { trimUserData } from 'key/utils/github';

import type GithubService from 'key/services/github';

import type { SessionData, TokenData } from 'key/types/auth';
import type { UserResponse } from 'key/types/github';

export const Authenticator = 'authenticator:github-pat';
export type AuthenticatorType = typeof Authenticator;

export default class GithubPatAuthenticator extends Base {
  @service('router') declare routerService: RouterService;
  @service('github') declare githubService: GithubService;

  /**
   * Resolves the session data and optionally refreshes the app.
   * @param resolve - The resolve function of the Promise.
   * @param tokenData - The array of token data.
   */
  resoveSessionData = (
    resolve: (value?: unknown) => void,
    tokenData: TokenData[]
  ) => {
    const sessionData: SessionData = {
      tokens: tokenData,
    };
    resolve(sessionData);

    // Refresh the app to reflect the new tokens.
    this.routerService.refresh();
  };

  /**
   * Authenticates with GitHub using a Personal Access Token (PAT).
   * If valid, stores the token in an array to allow adding more tokens later.
   * @param token - The GitHub Personal Access Token.
   * @param existingTokenData - The existing token data array.
   * @param errorHandler - Optional error handler callback.
   * @returns A Promise that resolves with the session data.
   */
  authenticate(
    token: string,
    existingTokenData: TokenData[] = [],
    errorHandler?: (error: string) => void
  ) {
    return new Promise((resolve, reject) => {
      const hasExistingTokenData = existingTokenData.length > 0;

      if (token) {
        const rejectWithReason = (reason: string) => {
          if (hasExistingTokenData) {
            if (errorHandler) {
              errorHandler(reason);
            }
            this.resoveSessionData(resolve, existingTokenData);
          } else {
            reject(reason);
          }
        };

        // Check if the token already exists
        if (existingTokenData.some((t) => t.id === token)) {
          rejectWithReason('Token already exists');
          return;
        }

        // Validate the token by fetching the user data
        this.githubService
          .fetch(`${this.githubService.BASE_URL}/user`, token)
          .then((data: UserResponse) => {
            if (data.login) {
              const tokens = [
                ...(hasExistingTokenData ? existingTokenData : []),
                {
                  id: token,
                  user: trimUserData(data),
                },
              ];
              this.resoveSessionData(resolve, tokens);
            } else {
              rejectWithReason('Invalid token');
            }
          })
          .catch(() => {
            rejectWithReason('Authentication failed');
          });
      } else if (hasExistingTokenData) {
        // If there's existing token data, refresh the session with it.
        this.resoveSessionData(resolve, existingTokenData);
      } else {
        reject('No token data provided');
      }
    });
  }

  /**
   * Restores the session from the stored data.
   * Checks that the data contains a non-empty tokens array.
   * @param sessionData - The session data.
   * @returns A Promise that resolves with the session data if valid.
   */
  restore(sessionData: SessionData) {
    return new Promise((resolve, reject) => {
      // Check if session data exists and has a valid tokens array.
      if (
        sessionData &&
        Array.isArray(sessionData.tokens) &&
        sessionData.tokens.length > 0
      ) {
        resolve(sessionData);
      } else {
        reject('No valid session data found');
      }
    });
  }
}
