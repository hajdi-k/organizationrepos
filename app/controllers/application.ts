import Controller from '@ember/controller';
import { getOwner } from '@ember/owner';

import Ember from 'ember';

type Lookup = `${string}:${string}`;

export default class ApplicationController extends Controller {
  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    if (!Ember.testing) {
      const app = getOwner(this);

      window.debug = function (item: string) {
        let parsedItem: Lookup;
        if (item.indexOf(':') === -1) {
          // if type not specified, type is service
          parsedItem = 'service:' + item;
        } else {
          parsedItem = item as Lookup;
        }
        return app?.lookup(parsedItem as Lookup);
      };
    }
  }
}
