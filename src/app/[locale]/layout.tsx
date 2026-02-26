import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navigation from "@/components/Navigation";
import { LanguageSwitcher } from "@/components/language-switcher";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: {
      default: t("siteName"),
      template: `%s | ${t("siteName")}`,
    },
    description:
      locale === "ja"
        ? "開発者とデザイナーのためのシンプルなデータ変換ツール"
        : "Simple data conversion tools for developers and designers",
    keywords: ["data converter", "unix time", "color converter", "datetime"],
    authors: [{ name: "Data Converter Site" }],
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ロケールの検証
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // メッセージの取得
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            {/* ヘッダー */}
            <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                <h1 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {t("siteName")}
                </h1>
                <LanguageSwitcher />
              </div>
            </header>

            {/* ナビゲーション */}
            <Navigation />

            {/* メインコンテンツ */}
            <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">{children}</main>

            {/* フッター */}
            <footer className="border-t border-zinc-200 bg-white py-4 sm:py-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                © 2024 {t("siteName")}
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
