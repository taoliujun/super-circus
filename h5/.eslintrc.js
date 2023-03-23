module.exports = {
  extends: ['@taoliujun/eslint-config/react'],

  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['/config/**/*'],
      },
    ],
    'max-lines-per-function': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
  },

  overrides: [
    {
      files: ['./config/**/*.ts'],
      rules: {
        'max-lines-per-function': ['off'],
        'no-console': ['off'],
      },
    },
    {
      files: [
        './src/service/**/*.ts',
        './src/pages/!(components)/index.tsx',
        './src/pages/!(components)/!(components)/index.tsx',
      ],
      rules: {
        'import/no-unused-modules': ['off'],
      },
    },
    {
      files: ['./src/**/*.tsx'],
      rules: {
        'import/order': [
          'error',
          {
            pathGroups: [
              { pattern: '../../**', group: 'type', position: 'after' },
              { pattern: '../**', group: 'type', position: 'after' },
              { pattern: './**', group: 'type', position: 'after' },
            ],
          },
        ],
      },
    },
  ],
};
