import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "AssignmentExpression[left.property.name='innerHTML']",
          message:
            'innerHTML is banned. Use DOM API (createElement + textContent + appendChild) instead.',
        },
        {
          selector: "MemberExpression[property.name='innerHTML']",
          message:
            'innerHTML is banned. Use DOM API (createElement + textContent + appendChild) instead.',
        },
      ],
    },
  },
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
);
