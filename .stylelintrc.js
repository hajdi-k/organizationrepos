'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-prettier/recommended'],
  overrides: [
    {
      files: ['**/*.css'],
      rules: {
        'import-notation': null, // Disable the rule
      },
    },
  ],
};
