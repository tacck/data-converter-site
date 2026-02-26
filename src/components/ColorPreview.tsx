import React from "react";
import { useTranslations } from "next-intl";

interface ColorPreviewProps {
  color: string;
  className?: string;
}

export function ColorPreview({ color, className = "" }: ColorPreviewProps) {
  const t = useTranslations("color");

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {t("preview")}
      </label>
      <div
        className="h-32 w-full rounded-lg border-2 border-zinc-300 shadow-sm transition-colors dark:border-zinc-700"
        style={{ backgroundColor: color }}
        data-testid="color-preview"
        aria-label={`${t("preview")}: ${color}`}
      />
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {color}
      </p>
    </div>
  );
}
