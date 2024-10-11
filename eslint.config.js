import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

export default {
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      languageOptions: {
        globals: globals.browser, 
      },
    
      ...tseslint.configs.recommended,
      ...pluginReact.configs.flat.recommended,
    },
  ],

  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'quotes': ['error', 'single'], 
    'react/react-in-jsx-scope': 'off', 
  },
  settings: {
    react: {
      version: 'detect', 
    },
  },
};
