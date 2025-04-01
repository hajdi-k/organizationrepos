import type { TOC } from '@ember/component/template-only';

interface IconsArrowComponentInterface {
  Element: HTMLDivElement;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Args: {};
}

const IconsArrowComponent: TOC<IconsArrowComponentInterface> = <template>
  <svg
    class='pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4'
    viewBox='0 0 16 16'
    fill='currentColor'
    aria-hidden='true'
    data-slot='icon'
  >
    <path
      fill-rule='evenodd'
      d='M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z'
      clip-rule='evenodd'
    />
  </svg>
</template>;

export default IconsArrowComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Icons::Arrow': typeof IconsArrowComponent;
  }
}
