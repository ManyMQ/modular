module.exports = {
    env: {
        node: true,
        es2021: true,
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        'react',
        '@typescript-eslint'
    ],
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'semi': ['error', 'always'],
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    ignorePatterns: ['examples/', 'node_modules/'],
};
