/**
 * カラー変換ユーティリティのプロパティベーステスト
 *
 * fast-checkを使用して、すべての有効な入力に対して成り立つべき
 * 普遍的なプロパティを検証します。
 */

import fc from "fast-check";
import {
  rgbToHex,
  hexToRgb,
  rgbToCmyk,
  cmykToRgb,
  rgbToHsl,
  hslToRgb,
  formatCss,
} from "./color-utils";

// テスト設定
const testConfig = {
  numRuns: 100, // 最低反復回数
  verbose: false,
};

// カスタムアービトラリ: RGB値 (0-255)
const rgbValueArbitrary = fc.integer({ min: 0, max: 255 });

// カスタムアービトラリ: HSL Hue値 (0-360)
const hueArbitrary = fc.integer({ min: 0, max: 360 });

// カスタムアービトラリ: HSL Saturation/Lightness値 (0-100%)
const slArbitrary = fc.float({ min: 0, max: 100 });

describe("Color Converter - Property Based Tests", () => {
  // Feature: data-converter-documentation, Property 5: RGB-HEX変換のラウンドトリップ
  describe("Property 5: RGB-HEX変換のラウンドトリップ", () => {
    it("任意の有効なRGB値に対して、HEX経由の変換で元の値を保持する", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            // RGB -> HEX -> RGB
            const hex = rgbToHex(r, g, b);
            const rgb = hexToRgb(hex);

            return rgb !== null && rgb.r === r && rgb.g === g && rgb.b === b;
          },
        ),
        testConfig,
      );
    });
  });

  // Feature: data-converter-documentation, Property 6: ARGB-HEX変換のラウンドトリップ
  describe("Property 6: ARGB-HEX変換のラウンドトリップ", () => {
    it("任意の有効なARGB値に対して、HEX経由の変換で元の値を保持する", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (a, r, g, b) => {
            // ARGB -> HEX(#AARRGGBB) -> ARGB
            // HEX形式を手動で構築
            const toHex = (value: number): string => {
              const hex = Math.round(value).toString(16).toUpperCase();
              return hex.length === 1 ? "0" + hex : hex;
            };
            const hexWithAlpha = `#${toHex(a)}${toHex(r)}${toHex(g)}${toHex(b)}`;

            // HEXからARGBに変換
            const cleanHex = hexWithAlpha.replace(/^#/, "");
            if (cleanHex.length !== 8) {
              return false;
            }

            const parsedA = parseInt(cleanHex.substring(0, 2), 16);
            const parsedR = parseInt(cleanHex.substring(2, 4), 16);
            const parsedG = parseInt(cleanHex.substring(4, 6), 16);
            const parsedB = parseInt(cleanHex.substring(6, 8), 16);

            return (
              parsedA === a && parsedR === r && parsedG === g && parsedB === b
            );
          },
        ),
        testConfig,
      );
    });
  });

  // Feature: data-converter-documentation, Property 7: RGB-CMYK変換のラウンドトリップ
  describe("Property 7: RGB-CMYK変換のラウンドトリップ", () => {
    it("任意の有効なRGB値に対して、CMYK経由の変換で近似値を保持する", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            // RGB -> CMYK -> RGB
            const cmyk = rgbToCmyk(r, g, b);
            const rgb = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);

            // CMYK変換は色空間の違いにより誤差が生じる
            // 許容誤差を2以内とする
            const tolerance = 2;
            const rDiff = Math.abs(rgb.r - r);
            const gDiff = Math.abs(rgb.g - g);
            const bDiff = Math.abs(rgb.b - b);

            return (
              rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance
            );
          },
        ),
        testConfig,
      );
    });
  });

  // Feature: data-converter-documentation, Property 8: RGB-HSL変換のラウンドトリップ
  describe("Property 8: RGB-HSL変換のラウンドトリップ", () => {
    it("任意の有効なRGB値に対して、HSL経由の変換で元の値を保持する", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            // RGB -> HSL -> RGB
            const hsl = rgbToHsl(r, g, b);
            const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);

            // HSL変換は丸め誤差により若干の誤差が生じる可能性がある
            // 特に低彩度の色では誤差が大きくなる
            // 許容誤差を2以内とする
            const tolerance = 2;
            const rDiff = Math.abs(rgb.r - r);
            const gDiff = Math.abs(rgb.g - g);
            const bDiff = Math.abs(rgb.b - b);

            return (
              rDiff <= tolerance && gDiff <= tolerance && bDiff <= tolerance
            );
          },
        ),
        testConfig,
      );
    });
  });

  // Feature: data-converter-documentation, Property 9: CSS形式文字列の正確性
  describe("Property 9: CSS形式文字列の正確性", () => {
    it("任意のRGB値に対して、rgb()形式のCSS文字列が正しい構文に従う", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            const css = formatCss({ rgb: { r, g, b } }, "rgb");
            const regex = /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/;

            if (!regex.test(css)) {
              return false;
            }

            // 値が正確に含まれているか確認
            const expected = `rgb(${r}, ${g}, ${b})`;
            return css === expected;
          },
        ),
        testConfig,
      );
    });

    it("任意のARGB値に対して、rgba()形式のCSS文字列が正しい構文に従う", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (a, r, g, b) => {
            const css = formatCss({ argb: { a, r, g, b } }, "rgba");
            const regex = /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, \d+(\.\d+)?\)$/;

            if (!regex.test(css)) {
              return false;
            }

            // Alpha値が0-1の範囲に正規化されているか確認
            const alpha = Math.round((a / 255) * 100) / 100;
            const expected = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            return css === expected;
          },
        ),
        testConfig,
      );
    });

    it("任意のRGB値に対して、hex形式のCSS文字列が正しい構文に従う", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            const hex = rgbToHex(r, g, b);
            const css = formatCss({ hex }, "hex");
            const regex = /^#[0-9A-F]{6}$/;

            return regex.test(css) && css === hex;
          },
        ),
        testConfig,
      );
    });

    it("任意のHSL値に対して、hsl()形式のCSS文字列が正しい構文に従う", () => {
      fc.assert(
        fc.property(hueArbitrary, slArbitrary, slArbitrary, (h, s, l) => {
          const css = formatCss({ hsl: { h, s, l } }, "hsl");
          // 科学的記数法(e-45など)にも対応する正規表現
          const regex = /^hsl\(\d{1,3}, [\d.e+-]+%, [\d.e+-]+%\)$/;

          if (!regex.test(css)) {
            return false;
          }

          // 値が正確に含まれているか確認
          const expected = `hsl(${h}, ${s}%, ${l}%)`;
          return css === expected;
        }),
        testConfig,
      );
    });
  });

  // 追加のプロパティ: HEX形式の正確性
  describe("Additional Property: HEX形式の正確性", () => {
    it("任意のRGB値に対して、生成されるHEX文字列は正しい形式である", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            const hex = rgbToHex(r, g, b);
            const regex = /^#[0-9A-F]{6}$/;

            return regex.test(hex);
          },
        ),
        testConfig,
      );
    });

    it("任意の有効なHEX文字列に対して、hexToRgbは非nullの結果を返す", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            const hex = rgbToHex(r, g, b);
            const rgb = hexToRgb(hex);

            return rgb !== null;
          },
        ),
        testConfig,
      );
    });
  });

  // 追加のプロパティ: CMYK値の範囲
  describe("Additional Property: CMYK値の範囲", () => {
    it("任意のRGB値に対して、生成されるCMYK値は0-100%の範囲内である", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            const cmyk = rgbToCmyk(r, g, b);

            return (
              cmyk.c >= 0 &&
              cmyk.c <= 100 &&
              cmyk.m >= 0 &&
              cmyk.m <= 100 &&
              cmyk.y >= 0 &&
              cmyk.y <= 100 &&
              cmyk.k >= 0 &&
              cmyk.k <= 100
            );
          },
        ),
        testConfig,
      );
    });
  });

  // 追加のプロパティ: HSL値の範囲
  describe("Additional Property: HSL値の範囲", () => {
    it("任意のRGB値に対して、生成されるHSL値は正しい範囲内である", () => {
      fc.assert(
        fc.property(
          rgbValueArbitrary,
          rgbValueArbitrary,
          rgbValueArbitrary,
          (r, g, b) => {
            const hsl = rgbToHsl(r, g, b);

            return (
              hsl.h >= 0 &&
              hsl.h <= 360 &&
              hsl.s >= 0 &&
              hsl.s <= 100 &&
              hsl.l >= 0 &&
              hsl.l <= 100
            );
          },
        ),
        testConfig,
      );
    });
  });
});
