import { useTranslations } from "next-intl";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations("home");
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
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("title")}
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {t("description")}
            </p>
          </div>

          {/* 機能カード */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 日時変換カード */}
            <Link
              href="/datetime"
              className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <h3 className="mb-2 text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                {t("datetimeCard.title")}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("datetimeCard.description")}
              </p>
            </Link>

            {/* カラー変換カード */}
            <Link
              href="/color"
              className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <h3 className="mb-2 text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                {t("colorCard.title")}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {t("colorCard.description")}
              </p>
            </Link>
          </div>
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
