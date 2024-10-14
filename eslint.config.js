import globals from 'globals';
import eslintJs from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsEslint from 'typescript-eslint';


export default tsEslint.config(
    {
        ignores: ['dist'],
    },
    {
        extends: [
            eslintJs.configs.recommended,
            ...tsEslint.configs.recommended,
        ],
        languageOptions: {
            parserOptions: {
                // projectService: true,
                tsconfigRootDir: import.meta.name,
            },
            ecmaVersion: 2020,
            globals: globals.browser,
            parser: tsEslint.parser,
        },
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                {allowConstantExport: true},
            ],
            indent: ['error', 4, {
                SwitchCase: 1,
                ignoredNodes: ['TemplateLiteral'],
            }],
            '@typescript-eslint/no-unused-vars': [1],
            semi: [2, 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': 1,
            'no-trailing-spaces': 1,
            quotes: ['error', 'single'],
            'quote-props': [1, 'as-needed'],
            'no-multi-spaces': 1,
            'key-spacing': [1],
        },
    },
);
