import Route from '@ember/routing/route';
import type Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';

import { RouteName } from 'key/components/nav';

import type SessionService from 'key/services/session';

export default class PatAuthenticatedRoute extends Route {
  @service('session') declare sessionService: SessionService;

  beforeModel(transition: Transition) {
    this.sessionService.requireAuthentication(transition, RouteName.ADD_TOKEN);
  }
}
