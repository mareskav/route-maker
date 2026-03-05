import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tsParser from "@typescript-eslint/parser"
import tseslint from "@typescript-eslint/eslint-plugin"
import importPlugin from "eslint-plugin-import"
import prettier from "eslint-config-prettier"

export default [
  js.configs.recommended,

  // TS/TSX
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["dist/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
        // Type-aware linting zatím NEzapínám (rychlejší). Až později můžeme přidat project.
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint,
      import: importPlugin
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: true,
        typescript: true
      }
    },
    rules: {
      // React 17+ JSX transform
      "react/react-in-jsx-scope": "off",

      // Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Vite fast refresh: export component-only (chrání HMR)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // TS sanity
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Import hygiene (volitelně přísnější)
      "import/no-duplicates": "warn",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true }
        }
      ]
    }
  },

  // Vypne ESLint pravidla co se hádají s Prettierem
  prettier
]
