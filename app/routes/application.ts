import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type SessionService from 'key/services/session';

export default class ApplicationRoute extends Route {
  @service('session') declare sessionService: SessionService;

  async beforeModel() {
    // Initialize the session service
    try {
      await this.sessionService.setup();
    } catch (error) {
      console.error('Session restoration failed:', error);
    }
  }
}
