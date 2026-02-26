"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { InputField } from "./InputField";
import { Button } from "./Button";
import { ColorPreview } from "./ColorPreview";
import {
  rgbToHex,
  hexToRgb,
  rgbToCmyk,
  cmykToRgb,
  rgbToHsl,
  hslToRgb,
  formatCss,
} from "@/lib/color-utils";

type ColorFormat = "rgb" | "argb" | "hex" | "cmyk" | "hsl";

interface ColorState {
  format: ColorFormat;
  rgb: { r: string; g: string; b: string };
  argb: { a: string; r: string; g: string; b: string };
  hex: string;
  cmyk: { c: string; m: string; y: string; k: string };
  hsl: { h: string; s: string; l: string };
  previewColor: string;
  error: string | null;
  copySuccess: boolean;
}

export function ColorConverter() {
  const t = useTranslations("color");
  const tErrors = useTranslations("errors");

  const [state, setState] = useState<ColorState>({
    format: "rgb",
    rgb: { r: "255", g: "0", b: "0" },
    argb: { a: "255", r: "255", g: "0", b: "0" },
    hex: "#FF0000",
    cmyk: { c: "0", m: "100", y: "100", k: "0" },
    hsl: { h: "0", s: "100", l: "50" },
    previewColor: "#FF0000",
    error: null,
    copySuccess: false,
  });

  // フォーマット切り替え
  const handleFormatChange = useCallback((format: ColorFormat) => {
    setState((prev) => ({ ...prev, format, error: null }));
  }, []);

  // RGB値の変更
  const handleRgbChange = useCallback(
    (field: "r" | "g" | "b", value: string) => {
      setState((prev) => ({
        ...prev,
        rgb: { ...prev.rgb, [field]: value },
        error: null,
        copySuccess: false,
      }));
    },
    [],
  );

  // ARGB値の変更
  const handleArgbChange = useCallback(
    (field: "a" | "r" | "g" | "b", value: string) => {
      setState((prev) => ({
        ...prev,
        argb: { ...prev.argb, [field]: value },
        error: null,
        copySuccess: false,
      }));
    },
    [],
  );

  // HEX値の変更
  const handleHexChange = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      hex: value,
      error: null,
      copySuccess: false,
    }));
  }, []);

  // CMYK値の変更
  const handleCmykChange = useCallback(
    (field: "c" | "m" | "y" | "k", value: string) => {
      setState((prev) => ({
        ...prev,
        cmyk: { ...prev.cmyk, [field]: value },
        error: null,
        copySuccess: false,
      }));
    },
    [],
  );

  // HSL値の変更
  const handleHslChange = useCallback(
    (field: "h" | "s" | "l", value: string) => {
      setState((prev) => ({
        ...prev,
        hsl: { ...prev.hsl, [field]: value },
        error: null,
        copySuccess: false,
      }));
    },
    [],
  );

  // 変換処理
  const convertColor = useCallback(() => {
    try {
      let rgb: { r: number; g: number; b: number } | null = null;

      // 現在のフォーマットからRGBに変換
      if (state.format === "rgb") {
        const r = parseInt(state.rgb.r);
        const g = parseInt(state.rgb.g);
        const b = parseInt(state.rgb.b);

        if (
          isNaN(r) ||
          isNaN(g) ||
          isNaN(b) ||
          r < 0 ||
          r > 255 ||
          g < 0 ||
          g > 255 ||
          b < 0 ||
          b > 255
        ) {
          setState((prev) => ({ ...prev, error: tErrors("invalidRGB") }));
          return;
        }

        rgb = { r, g, b };
      } else if (state.format === "argb") {
        const a = parseInt(state.argb.a);
        const r = parseInt(state.argb.r);
        const g = parseInt(state.argb.g);
        const b = parseInt(state.argb.b);

        if (
          isNaN(a) ||
          isNaN(r) ||
          isNaN(g) ||
          isNaN(b) ||
          a < 0 ||
          a > 255 ||
          r < 0 ||
          r > 255 ||
          g < 0 ||
          g > 255 ||
          b < 0 ||
          b > 255
        ) {
          setState((prev) => ({ ...prev, error: tErrors("invalidRGB") }));
          return;
        }

        rgb = { r, g, b };
      } else if (state.format === "hex") {
        rgb = hexToRgb(state.hex);
        if (!rgb) {
          setState((prev) => ({ ...prev, error: tErrors("invalidHex") }));
          return;
        }
      } else if (state.format === "cmyk") {
        const c = parseFloat(state.cmyk.c);
        const m = parseFloat(state.cmyk.m);
        const y = parseFloat(state.cmyk.y);
        const k = parseFloat(state.cmyk.k);

        if (
          isNaN(c) ||
          isNaN(m) ||
          isNaN(y) ||
          isNaN(k) ||
          c < 0 ||
          c > 100 ||
          m < 0 ||
          m > 100 ||
          y < 0 ||
          y > 100 ||
          k < 0 ||
          k > 100
        ) {
          setState((prev) => ({ ...prev, error: tErrors("invalidCMYK") }));
          return;
        }

        rgb = cmykToRgb(c, m, y, k);
      } else if (state.format === "hsl") {
        const h = parseFloat(state.hsl.h);
        const s = parseFloat(state.hsl.s);
        const l = parseFloat(state.hsl.l);

        if (
          isNaN(h) ||
          isNaN(s) ||
          isNaN(l) ||
          h < 0 ||
          h > 360 ||
          s < 0 ||
          s > 100 ||
          l < 0 ||
          l > 100
        ) {
          setState((prev) => ({ ...prev, error: tErrors("invalidHSL") }));
          return;
        }

        rgb = hslToRgb(h, s, l);
      }

      if (!rgb) {
        setState((prev) => ({ ...prev, error: tErrors("conversionError") }));
        return;
      }

      // RGBから他の形式に変換
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      setState((prev) => ({
        ...prev,
        rgb: {
          r: rgb!.r.toString(),
          g: rgb!.g.toString(),
          b: rgb!.b.toString(),
        },
        argb: {
          ...prev.argb,
          r: rgb!.r.toString(),
          g: rgb!.g.toString(),
          b: rgb!.b.toString(),
        },
        hex,
        cmyk: {
          c: cmyk.c.toString(),
          m: cmyk.m.toString(),
          y: cmyk.y.toString(),
          k: cmyk.k.toString(),
        },
        hsl: {
          h: hsl.h.toString(),
          s: hsl.s.toString(),
          l: hsl.l.toString(),
        },
        previewColor: hex,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : tErrors("conversionError"),
      }));
    }
  }, [
    state.format,
    state.rgb,
    state.argb,
    state.hex,
    state.cmyk,
    state.hsl,
    tErrors,
  ]);

  // CSSコピー機能
  const copyToClipboard = useCallback(
    async (format: "rgb" | "rgba" | "hex" | "hsl") => {
      try {
        let cssString = "";

        if (format === "rgb") {
          const r = parseInt(state.rgb.r);
          const g = parseInt(state.rgb.g);
          const b = parseInt(state.rgb.b);
          cssString = formatCss({ rgb: { r, g, b } }, "rgb");
        } else if (format === "rgba") {
          const a = parseInt(state.argb.a);
          const r = parseInt(state.argb.r);
          const g = parseInt(state.argb.g);
          const b = parseInt(state.argb.b);
          cssString = formatCss({ argb: { a, r, g, b } }, "rgba");
        } else if (format === "hex") {
          cssString = formatCss({ hex: state.hex }, "hex");
        } else if (format === "hsl") {
          const h = parseFloat(state.hsl.h);
          const s = parseFloat(state.hsl.s);
          const l = parseFloat(state.hsl.l);
          cssString = formatCss({ hsl: { h, s, l } }, "hsl");
        }

        await navigator.clipboard.writeText(cssString);
        setState((prev) => ({ ...prev, copySuccess: true }));

        setTimeout(() => {
          setState((prev) => ({ ...prev, copySuccess: false }));
        }, 2000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : tErrors("copyError");
        setState((prev) => ({ ...prev, error: errorMessage }));
      }
    },
    [state.rgb, state.argb, state.hex, state.hsl, tErrors],
  );

  // 初回レンダリング時に変換を実行
  useEffect(() => {
    convertColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* フォーマット選択 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <label
          id="format-label"
          className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {t("format")}
        </label>
        <div
          role="group"
          aria-labelledby="format-label"
          className="flex flex-wrap gap-2"
        >
          {(["rgb", "argb", "hex", "cmyk", "hsl"] as ColorFormat[]).map(
            (format) => (
              <button
                key={format}
                onClick={() => handleFormatChange(format)}
                aria-pressed={state.format === format}
                className={`rounded-md px-3 sm:px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                  state.format === format
                    ? "bg-blue-600 text-white dark:bg-blue-500"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {t(format)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* カラープレビュー */}
      <ColorPreview color={state.previewColor} />

      {/* 入力フィールド */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {state.format === "rgb" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              label={t("red")}
              value={state.rgb.r}
              onChange={(value) => handleRgbChange("r", value)}
              placeholder={t("placeholder.rgb")}
              error={state.error || ""}
            />
            <InputField
              label={t("green")}
              value={state.rgb.g}
              onChange={(value) => handleRgbChange("g", value)}
              placeholder={t("placeholder.rgb")}
              error={state.error || ""}
            />
            <InputField
              label={t("blue")}
              value={state.rgb.b}
              onChange={(value) => handleRgbChange("b", value)}
              placeholder={t("placeholder.rgb")}
              error={state.error || ""}
            />
          </div>
        )}

        {state.format === "argb" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InputField
              label={t("alpha")}
              value={state.argb.a}
              onChange={(value) => handleArgbChange("a", value)}
              placeholder={t("placeholder.alpha")}
              error={state.error || ""}
            />
            <InputField
              label={t("red")}
              value={state.argb.r}
              onChange={(value) => handleArgbChange("r", value)}
              placeholder={t("placeholder.rgb")}
              error={state.error || ""}
            />
            <InputField
              label={t("green")}
              value={state.argb.g}
              onChange={(value) => handleArgbChange("g", value)}
              placeholder={t("placeholder.rgb")}
              error={state.error || ""}
            />
            <InputField
              label={t("blue")}
              value={state.argb.b}
              onChange={(value) => handleArgbChange("b", value)}
              placeholder={t("placeholder.rgb")}
              error={state.error || ""}
            />
          </div>
        )}

        {state.format === "hex" && (
          <InputField
            label={t("hex")}
            value={state.hex}
            onChange={(value) => handleHexChange(value)}
            placeholder={t("placeholder.hex")}
            error={state.error || ""}
          />
        )}

        {state.format === "cmyk" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InputField
              label={t("cyan")}
              value={state.cmyk.c}
              onChange={(value) => handleCmykChange("c", value)}
              placeholder={t("placeholder.cmyk")}
              error={state.error || ""}
            />
            <InputField
              label={t("magenta")}
              value={state.cmyk.m}
              onChange={(value) => handleCmykChange("m", value)}
              placeholder={t("placeholder.cmyk")}
              error={state.error || ""}
            />
            <InputField
              label={t("yellow")}
              value={state.cmyk.y}
              onChange={(value) => handleCmykChange("y", value)}
              placeholder={t("placeholder.cmyk")}
              error={state.error || ""}
            />
            <InputField
              label={t("key")}
              value={state.cmyk.k}
              onChange={(value) => handleCmykChange("k", value)}
              placeholder={t("placeholder.cmyk")}
              error={state.error || ""}
            />
          </div>
        )}

        {state.format === "hsl" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <InputField
              label={t("hue")}
              value={state.hsl.h}
              onChange={(value) => handleHslChange("h", value)}
              placeholder={t("placeholder.hue")}
              error={state.error || ""}
            />
            <InputField
              label={t("saturation")}
              value={state.hsl.s}
              onChange={(value) => handleHslChange("s", value)}
              placeholder={t("placeholder.percent")}
              error={state.error || ""}
            />
            <InputField
              label={t("lightness")}
              value={state.hsl.l}
              onChange={(value) => handleHslChange("l", value)}
              placeholder={t("placeholder.percent")}
              error={state.error || ""}
            />
          </div>
        )}

        <div className="mt-4">
          <Button
            label={t("convert")}
            onClick={convertColor}
            variant="primary"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* 変換結果とCSSコピー */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("copyCSS")}
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <Button
            label="RGB"
            onClick={() => copyToClipboard("rgb")}
            variant="secondary"
            ariaLabel={`${t("copyCSS")} RGB`}
          />
          <Button
            label="RGBA"
            onClick={() => copyToClipboard("rgba")}
            variant="secondary"
            ariaLabel={`${t("copyCSS")} RGBA`}
          />
          <Button
            label="HEX"
            onClick={() => copyToClipboard("hex")}
            variant="secondary"
            ariaLabel={`${t("copyCSS")} HEX`}
          />
          <Button
            label="HSL"
            onClick={() => copyToClipboard("hsl")}
            variant="secondary"
            ariaLabel={`${t("copyCSS")} HSL`}
          />
        </div>

        {state.copySuccess && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400"
          >
            {t("copied")}
          </div>
        )}
      </div>

      {/* エラー表示 */}
      {state.error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          {state.error}
        </div>
      )}
    </div>
  );
}
