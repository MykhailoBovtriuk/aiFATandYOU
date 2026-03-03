const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

module.exports = [
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**", "**/*.config.js", "**/*.config.ts"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": "warn",
    },
  },
];
