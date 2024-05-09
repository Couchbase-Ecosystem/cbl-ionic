module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        "plugin:@typescript-eslint/recommended",
        'eslint:recommended'
    ],
    plugins: ["@typescript-eslint"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        "sourceType": "module",
    },
    rules: {
    }
}
