import js from "@eslint/js";
import globals from "globals";

const eslintConfig = [
  {
    ignores: [
      "**/.next/**",
      "**/node_modules/**",
      "**/playwright-report/**",
      "src/**",
      "tests/**"
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      }
    }
  }
];

export default eslintConfig;
