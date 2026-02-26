"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useEffect } from "react";

const LOCALE_STORAGE_KEY = "preferred-locale";

export function LanguageSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // マウント時にlocalStorageから保存された言語設定を読み込む
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

      // 保存されたロケールが有効で、現在のロケールと異なる場合は切り替え
      if (
        savedLocale &&
        routing.locales.includes(
          savedLocale as (typeof routing.locales)[number],
        ) &&
        savedLocale !== locale
      ) {
        router.replace(pathname, { locale: savedLocale });
      }
    } catch (error) {
      // localStorageが利用できない環境（プライベートブラウジングなど）への対応
      console.warn("Failed to load locale from localStorage:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // マウント時のみ実行

  const handleLocaleChange = (newLocale: string) => {
    try {
      // localStorageに選択された言語を保存
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch (error) {
      // localStorageが利用できない環境への対応
      console.warn("Failed to save locale to localStorage:", error);
    }

    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="language-select"
        className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400"
      >
        {t("language")}:
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        aria-label={t("language")}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs sm:text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-offset-zinc-900"
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
