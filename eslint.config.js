import globals from "globals"
import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import stylisticJs from "@stylistic/eslint-plugin-js"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: ["dist"],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
    ],
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: { ecmaVersion: 2020, globals: globals.browser },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@stylistic/js": stylisticJs,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", {
        allowConstantExport: true,
      }],

      // Our rules
      "@typescript-eslint/no-non-null-assertion": "off",

      // Stylistic rules
      "@stylistic/js/array-bracket-newline": ["error", "consistent"],
      "@stylistic/js/array-bracket-spacing": ["error", "never"],
      "@stylistic/js/array-element-newline": ["error", "consistent"],
      "@stylistic/js/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/js/comma-dangle": ["error", "always-multiline"],
      "@stylistic/js/eol-last": ["error", "always"],
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/js/no-multi-spaces": ["error"],
      "@stylistic/js/no-multiple-empty-lines": ["error", { max: 1 }],
      "@stylistic/js/no-trailing-spaces": ["error"],
      "@stylistic/js/object-curly-newline": ["error", { "consistent": true }],
      "@stylistic/js/object-property-newline": ["error", { allowAllPropertiesOnSameLine: true }],
      "@stylistic/js/object-curly-spacing": ["error", "always"],
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/semi": ["error", "never"],
    },
  },
)
