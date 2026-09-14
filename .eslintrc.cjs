module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:storybook/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: [
    "dist",
    "dist-demo",
    "dev-dist",
    "storybook-static",
    ".tmp-live-*",
    ".eslintrc.cjs",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
      plugins: ["@typescript-eslint"],
      extends: ["plugin:@typescript-eslint/recommended"],
      env: { browser: true, es2020: true },
    },
  ],
  rules: {
    // This JavaScript codebase does not use runtime PropTypes. API contracts are
    // covered by component tests and backend response normalization instead.
    "react/prop-types": "off",
    // Existing CSF exports intentionally retain their public camelCase names.
    "storybook/prefer-pascal-case": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  globals: {
    // Replaced at build time by Vite's `define` option.
    __DEMO_BUILD__: "readonly",
  },
};
