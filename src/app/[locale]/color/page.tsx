import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ColorConverter } from "@/components/ColorConverter";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Code Converter | Data Converter Site",
  description:
    "Convert between RGB, ARGB, HEX, CMYK, and HSL color formats with live preview",
};

export default function ColorPage() {
  const t = useTranslations("color");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* ヘッダー */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {tCommon("siteName")}
          </h1>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {tCommon("home")}
            </Link>
            <Link
              href="/datetime"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {tCommon("datetime")}
            </Link>
            <Link
              href="/color"
              className="text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              {tCommon("color")}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex flex-1 items-start justify-center px-6 py-12">
        <div className="w-full max-w-4xl">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("title")}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t("description")}
            </p>
          </div>

          {/* ColorConverterコンポーネント */}
          <ColorConverter />
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          © 2024 {tCommon("siteName")}
        </div>
      </footer>
    </div>
  );
}
