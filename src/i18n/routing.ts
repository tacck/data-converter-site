import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // サポートされるロケール
  locales: ["en", "ja"],

  // デフォルトロケール
  defaultLocale: "en",
});

// 型安全なナビゲーションヘルパー
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
