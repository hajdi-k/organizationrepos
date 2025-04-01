import type { TOC } from '@ember/component/template-only';

interface IconsLogoutComponentInterface {
  Element: HTMLDivElement;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  Args: {};
}

const IconsLogoutComponent: TOC<IconsLogoutComponentInterface> = <template>
  <svg
    width='800px'
    height='800px'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M15 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H15M8 8L4 12M4 12L8 16M4 12L16 12'
      stroke='#000000'
      stroke-width='1.5'
      stroke-linecap='round'
      stroke-linejoin='round'
    />
  </svg>
</template>;

export default IconsLogoutComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Icons::Logout': typeof IconsLogoutComponent;
  }
}
