import Component from '@glimmer/component';

import type { Repo } from 'key/models/custom/repo';

interface Args {
  repos: Repo[];
}
interface ReposListIndexComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class ReposListIndexComponent extends Component<
  ReposListIndexComponentInterface<Args>
> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Repos::List': typeof ReposListIndexComponent;
  }
}
