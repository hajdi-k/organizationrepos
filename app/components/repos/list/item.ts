import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import type { Repo } from 'key/models/custom/repo';

interface Args {
  repo: Repo;
}
interface ReposListItemComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}
export default class ReposListItemComponent extends Component<
  ReposListItemComponentInterface<Args>
> {
  @tracked isExpanded = false;

  get activeClass() {
    return this.isExpanded ? 'bg-gray-100' : '';
  }

  @action
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Repos::List::Item': typeof ReposListItemComponent;
  }
}
