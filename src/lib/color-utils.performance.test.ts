/**
 * カラー変換ユーティリティのパフォーマンステスト
 * Requirements: 10.1 - 100ミリ秒以内の応答を確認
 */

import {
  rgbToHex,
  hexToRgb,
  rgbToCmyk,
  cmykToRgb,
  rgbToHsl,
  hslToRgb,
  formatCss,
} from "./color-utils";

describe("Color Utils - Performance Tests", () => {
  describe("Requirements 10.1: 100ミリ秒以内の応答", () => {
    it("RGB to HEX変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 128, g: 128, b: 128 },
        { r: 255, g: 255, b: 255 },
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        rgbToHex(testCase.r, testCase.g, testCase.b);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("HEX to RGB変換が100ミリ秒以内に完了する", () => {
      const testCases = ["#FF0000", "#00FF00", "#0000FF", "#808080", "#FFFFFF"];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        hexToRgb(testCase);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("RGB to CMYK変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 128, g: 64, b: 192 },
        { r: 255, g: 128, b: 64 },
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        rgbToCmyk(testCase.r, testCase.g, testCase.b);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("CMYK to RGB変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        { c: 0, m: 100, y: 100, k: 0 },
        { c: 100, m: 0, y: 100, k: 0 },
        { c: 100, m: 100, y: 0, k: 0 },
        { c: 50, m: 25, y: 75, k: 10 },
        { c: 0, m: 50, y: 75, k: 0 },
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        cmykToRgb(testCase.c, testCase.m, testCase.y, testCase.k);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("RGB to HSL変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 128, g: 128, b: 128 },
        { r: 255, g: 255, b: 255 },
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        rgbToHsl(testCase.r, testCase.g, testCase.b);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("HSL to RGB変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        { h: 0, s: 100, l: 50 },
        { h: 120, s: 100, l: 50 },
        { h: 240, s: 100, l: 50 },
        { h: 180, s: 50, l: 50 },
        { h: 300, s: 75, l: 60 },
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        hslToRgb(testCase.h, testCase.s, testCase.l);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("CSS形式変換が100ミリ秒以内に完了する", () => {
      const colorValues = {
        rgb: { r: 255, g: 128, b: 64 },
        argb: { a: 255, r: 255, g: 128, b: 64 },
        hex: "#FF8040",
        hsl: { h: 20, s: 100, l: 63 },
      };

      const formats: Array<"rgb" | "rgba" | "hex" | "hsl"> = [
        "rgb",
        "rgba",
        "hex",
        "hsl",
      ];

      formats.forEach((format) => {
        const startTime = performance.now();

        formatCss(colorValues, format);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("100回の連続変換が各100ミリ秒以内に完了する", () => {
      for (let i = 0; i < 100; i++) {
        const startTime = performance.now();

        const hex = rgbToHex(255, 128, 64);
        hexToRgb(hex);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      }
    });

    it("複雑な変換チェーンが100ミリ秒以内に完了する", () => {
      const testCases = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        // RGB -> HEX -> RGB -> CMYK -> RGB -> HSL -> RGB
        const hex = rgbToHex(testCase.r, testCase.g, testCase.b);
        const rgb1 = hexToRgb(hex);
        if (rgb1) {
          const cmyk = rgbToCmyk(rgb1.r, rgb1.g, rgb1.b);
          const rgb2 = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
          const hsl = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);
          hslToRgb(hsl.h, hsl.s, hsl.l);
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });
  });
});
