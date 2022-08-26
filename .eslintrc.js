module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:import/typescript'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        eslintIntegration: true,
        stylelintIntegration: true,
        printWidth: 120,
        useTabs: false,
        tabWidth: 2,
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        endOfLine: 'lf',
        arrowParens: 'avoid',
      },
      {
        usePrettierrc: false,
      },
    ],
    'import/order': ['error', { 'newlines-between': 'never' }],
    '@typescript-eslint/consistent-type-imports': 'error',

    '@typescript-eslint/no-extra-semi': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': ['error', { ignore: ['swagger-schema-official'] }],
    'no-param-reassign': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['jest.config.ts', '__tests__/**/*.ts', 'src/requester/*'],
        optionalDependencies: false,
      },
    ],

    // let prettier handle indent
    '@typescript-eslint/indent': 0,
    // '@typescript-eslint/interface-name-prefix': [1, 'always'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],

    // skip check var starts with "_"
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error', { overrides: { constructors: 'no-public' } }],
  },
}
