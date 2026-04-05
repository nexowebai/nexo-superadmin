import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
    { ignores: ["dist", "node_modules", ".git", ".github"] },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: 2024,
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        settings: {
            react: { version: "detect" },
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,
            "react/prop-types": "off",
            "react-refresh/only-export-components": "warn",
            "no-unused-vars": "warn",
            "no-console": "warn",
            "react/react-in-jsx-scope": "off",
            "react/no-unescaped-entities": "off",
            "react-hooks/rules-of-hooks": "warn", // Relaxed to warning
            "react-hooks/exhaustive-deps": "warn",
            "no-undef": "warn", // Relaxed to warning as requested
            "no-restricted-syntax": [
                "warn",
                {
                    selector: "AwaitExpression",
                    message: "STRICT VIOLATION: async/await is forbidden to maintain predictable state flow. Use .then().catch() instead.",
                },
                {
                    selector: "OptionalMemberExpression",
                    message: "STRICT VIOLATION: Optional chaining (?.) is forbidden for institutional-grade reliability. Use explicit checks.",
                },
            ],
        },

    },
];
