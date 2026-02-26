import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex items-center justify-center px-6 py-16">
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
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
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
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <svg
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
              {t("colorCard.title")}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {t("colorCard.description")}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
