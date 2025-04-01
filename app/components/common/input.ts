/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

const containerClasses = 'flex w-full flex-wrap items-stretch';
const inputClasses =
  'grow rounded-md placeholder:text-gray-400 text-base focus:outline-none py-1 px-3 sm:text-sm/6 text-gray-900 bg-white border-2 border-gray-300 border-solid focus:border-sky-600 font-normal leading-[1.2] m-0 outline-1 -outline-offset-1 outline-gray-300 focus:-outline-offset-2 focus:outline-indigo-600';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any;

interface Args {
  onValueChange: (value: Value) => void;
  initialValue?: Value;
  type?: string;
  name?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  containerClasses?: string;
  inputClasses?: string;
}

interface CommonInputComponentInterface<T> {
  Args: T;
  Blocks: { default: [] }; // this is needed for yield
}

export default class CommonInputComponent extends Component<
  CommonInputComponentInterface<Args>
> {
  @tracked value = this.initialValueBasedOnType();

  get type() {
    return this.args.type ?? 'text';
  }

  get name() {
    return this.args.name ?? '';
  }

  get id() {
    return this.args.id ?? '';
  }

  get placeholder() {
    return this.args.placeholder ?? '';
  }

  get label() {
    return this.args.label ?? '';
  }

  get containerClasses() {
    const argsClasses = this.args.containerClasses ?? '';
    return containerClasses + (argsClasses ? ' ' + argsClasses : '');
  }

  get inputClasses() {
    const argsClasses = this.args.inputClasses ?? '';
    return inputClasses + (argsClasses ? ' ' + argsClasses : '');
  }

  initialValueBasedOnType(): string | number {
    const initialValue = this.args.initialValue,
      type = this.type;

    switch (type) {
      case 'number':
        return typeof initialValue === 'number' ? initialValue : 0;
      default:
        return typeof initialValue === 'string' ? initialValue : '';
    }
  }

  @action
  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target?.value.trim() ?? ''; // TODO DOMPurify.sanitize(value)
    this.args.onValueChange(this.value);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Common::Input': typeof CommonInputComponent;
  }
}
