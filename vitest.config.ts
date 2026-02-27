import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // グローバルAPI有効化（describe, it, expect）
    globals: true,

    // jsdom環境（React コンポーネントテスト用）
    environment: "jsdom",

    // セットアップファイル
    setupFiles: ["./vitest.setup.ts"],

    // テストファイルパターン
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    // 除外パターン
    exclude: ["node_modules", "dist", ".next", "**/*.d.ts"],

    // カバレッジ設定
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/node_modules/**",
        "**/.next/**",
      ],
    },

    // ESMモジュールの処理
    server: {
      deps: {
        inline: ["next-intl", "use-intl"],
      },
    },
  },

  // パスエイリアス
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
