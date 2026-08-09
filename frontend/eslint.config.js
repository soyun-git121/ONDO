/**
 * ESLint 9 flat config (Vite + React 18 + TS).
 * ESLint 9는 .eslintrc를 더 이상 읽지 않으므로 이 파일이 유일한 정본 설정.
 *
 * 타입 검사는 tsc가 담당(`npm run build`)하므로 여기서는 type-aware 룰을 쓰지 않는다.
 * — 프로젝트 서비스 없이 파일 단위로만 파싱해 lint 속도를 유지.
 */
import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist/**", "node_modules/**", "eslint.config.js"] },

  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // HMR 경계: 컴포넌트 파일은 컴포넌트만 export (상수 export는 허용)
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // 미사용 변수는 tsc(noUnusedLocals)와 중복 → _ 접두사는 의도적 무시로 취급
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  },
];
