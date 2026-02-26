import { useTranslations } from "next-intl";
import { ColorConverter } from "@/components/ColorConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Code Converter",
  description:
    "Convert between RGB, ARGB, HEX, CMYK, and HSL color formats with live preview",
};

export default function ColorPage() {
  const t = useTranslations("color");

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {t("description")}
        </p>
      </div>

      {/* ColorConverterコンポーネント */}
      <ColorConverter />
    </div>
  );
}
