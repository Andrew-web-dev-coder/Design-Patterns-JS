import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";

export default [
  {
    ignores: ["node_modules/", "coverage/", "dist/"],
  },

  js.configs.recommended,


  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylistic,

 
  {
    files: ["**/*.test.ts"],
    plugins: {
      jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
    },
  },

  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-var-requires": "error",

      "no-unused-vars": "off",
      "no-throw-literal": "error",
      "no-useless-constructor": "off",
    },
  },
];
