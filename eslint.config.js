// eslint.config.cjs

const js = require("@eslint/js");
const parser = require("@typescript-eslint/parser");
const plugin = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-config-prettier");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  js.configs.recommended,
  prettier,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": plugin,
    },
    rules: {
      semi: [2, "always"],
      "space-before-function-paren": [
        0,
        { anonymous: "always", named: "always" },
      ],
       "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Ignore unused variables that start with _
      camelcase: 0,
      "no-return-assign": 0,
      quotes: ["error", "single"],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];
