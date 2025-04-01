'use strict';

module.exports = {
  trailingComma: 'es5',
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-ember-template-tag',
  ],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderSeparation: true,
  importOrder: [
    '@(ember|glimmer)/',
    '<THIRD_PARTY_MODULES>',
    'key/(enums|utils|const)/',
    'key/(adapters|serializers)/',
    'key/(decorators|modifiers|helpers)/',
    'key/(routes|controllers|components)/',
    'key/models/',
    'key/services/',
    'key/',
  ],
  overrides: [
    {
      files: '*.hbs',
      options: {
        singleQuote: true,
      },
    },
    {
      files: '*.{js,gjs,ts,gts,mjs,mts,cjs,cts}',
      options: {
        singleQuote: true,
      },
    },
    {
      files: '*.{gjs,gts}',
      options: {
        singleQuote: true,
        templateSingleQuote: true,
      },
    },
  ],
};
