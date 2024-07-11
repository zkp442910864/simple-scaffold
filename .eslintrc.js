

module.exports = {
    // Umi 项目
    extends: [
        require.resolve('umi/eslint'),
        '@zzzz-/eslint-config-test',
    ],
    globals: {
        TObj: true,
        JSX: true,
    },
    rules: {
        indent: ['off'],
        'import/no-unresolved': ['off'],
        // 'import/no-unresolved': [2, {
        //     ignore: ['^umi/'],
        //     caseSensitive: true,
        //     caseSensitiveStrict: true,
        // }],
    },
};
