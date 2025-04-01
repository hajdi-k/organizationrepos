import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

import type UiHelperService from 'key/services/ui-helper';

export default class PatAddController extends Controller {
  @service('ui-helper') declare uiHelperService: UiHelperService; // Do not remove file, this line is needed
}
