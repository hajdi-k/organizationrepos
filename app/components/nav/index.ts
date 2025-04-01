import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

import type SessionService from 'key/services/session';

export const enum RouteName {
  INDEX = 'index',
  TOKENS = 'pat.authenticated.tokens',
  ADD_TOKEN = 'pat.add',
}

const routeDetails = {
  [RouteName.INDEX]: { name: 'Home' },
  [RouteName.TOKENS]: { name: 'Tokens', requiresAuth: true },
};

interface NavigationLink {
  name: string;
  route: string;
  requiresAuth?: boolean;
}

const navigationLinks: NavigationLink[] = Object.entries(routeDetails).map(
  ([route, details]) => {
    const { name, requiresAuth = false } =
      'requiresAuth' in details
        ? details
        : { ...{ requiresAuth: false }, ...details };

    return {
      name,
      route,
      requiresAuth,
    };
  }
);

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Args {}
interface NavIndexComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}

export default class NavIndexComponent extends Component<
  NavIndexComponentInterface<Args>
> {
  @service('session') declare sessionService: SessionService;
  @service('router') declare routerService: RouterService;

  tokenButtonClasses =
    'inline-flex items-center px-2 py-1 text-sm text-gray-900 hover:bg-gray-200 rounded-md focus:outline-none [&>svg]:w-6 [&>svg]:h-6 [&>svg]:ml-2';

  get navigationLinks() {
    return navigationLinks
      .filter((route) => (route.requiresAuth ? this.isAuthenticated : true))
      .map((l) => {
        const isActive = this.routerService.isActive(l.route);
        return {
          ...l,
          isActive,
          classes: isActive
            ? 'bg-sky-700 text-white'
            : 'text-gray-900 hover:bg-sky-500 hover:text-white',
        };
      });
  }

  get isAuthenticated() {
    return this.sessionService.isAuthenticated;
  }

  get isRouteAddToken() {
    return this.routerService.currentRouteName === RouteName.ADD_TOKEN;
  }

  get revokeTokensText() {
    return this.sessionService.tokens.length > 1
      ? 'Revoke all tokens'
      : 'Revoke token';
  }

  @action
  revokeTokens() {
    this.sessionService.invalidate();
  }

  @action
  addToken() {
    this.routerService.transitionTo(RouteName.ADD_TOKEN);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Nav: typeof NavIndexComponent;
  }
}
