// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root         : true,
    parser       : 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
    },
    env          : {
        browser: true,
        mocha  : true,
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends      : [
        'eslint:recommended',
        'airbnb-base',
    ],
    // required to lint *.vue files
    plugins      : [
        'html',
    ],
    // check if imports actually resolve
    settings     : {
        'import/resolver': {
            'webpack': {
                config: 'build/webpack.base.conf.js',
            },
        },
    },
    globals      : {
        expect: true,
        sinon : true,
    },
    // add your custom rules here
    rules        : {
        // don't require .vue extension when importing
        'import/extensions'                : ['off', 'never', {
            js : 'never',
            vue: 'never',
        }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            optionalDependencies: ['test/unit/index.js'],
        }],
        'semi'                             : ['error', 'always'],
        'key-spacing'                      : ["error", {
            align: "colon",
        }],
        'comma-dangle'                     : ['error', 'always-multiline'],
        'space-before-function-paren'      : ['error', 'never'],
        'object-curly-spacing'             : ['error', 'always'],
        'no-multi-spaces'                  : ['error', {
            exceptions: {
                VariableDeclarator: true,
                ImportDeclaration : true,
            },
        }],
        // 'import/no-unresolved': [0, { commonjs: true, amd: true }],
        // allow debugger during development
        'no-debugger'                      : process.env.NODE_ENV === 'production' ? 2 : 0,
        'indent'                           : ['error', 4, {
            SwitchCase: 1,
        }],
    },
};
