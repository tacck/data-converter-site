import { useTranslations } from "next-intl";
import { DateTimeConverter } from "@/components/DateTimeConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DateTime Converter",
  description:
    "Convert between human-readable datetime and Unix Time (epoch time)",
};

export default function DateTimePage() {
  const t = useTranslations("datetime");

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h2>
      </div>

      {/* DateTimeConverterコンポーネント */}
      <DateTimeConverter />
    </div>
  );
}
