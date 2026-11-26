import next from "eslint-config-next/core-web-vitals";
import ts from "eslint-config-next/typescript";
const config = [
  ...next,
  ...ts,
  {
    ignores: [
      "**/.next/**",
      "**/next-env.d.ts",
      "coverage/**",
      "test-results/**",
      "playwright-report/**",
      "supabase/**",
    ],
  },
  { settings: { next: { rootDir: "apps/web/" } } },
];

export default config;
