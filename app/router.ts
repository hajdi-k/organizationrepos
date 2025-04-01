import EmberRouter from '@ember/routing/router';

import config from 'key/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Personal Access Token Routes
  this.route('pat', function () {
    // login route
    this.route('add', { path: '/add-token' });

    // authenticated routes
    this.route('authenticated', { path: '' }, function () {
      this.route('tokens');
    });
  });
});
