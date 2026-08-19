export default [
  {
    files: ["assets/js/**/*.js", "tests/**/*.js", "playwright.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        localStorage: "readonly",
        matchMedia: "readonly",
        navigator: "readonly",
        process: "readonly",
        window: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-var": "error",
      "prefer-const": "error",
    },
  },
];
