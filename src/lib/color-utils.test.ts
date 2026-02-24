/**
 * カラー変換ユーティリティのユニットテスト
 *
 * 具体的な色の変換例、エッジケース、エラーハンドリングをテストします。
 * Requirements: 3.6
 */

import {
  rgbToHex,
  hexToRgb,
  rgbToCmyk,
  cmykToRgb,
  rgbToHsl,
  hslToRgb,
  validateColorValue,
  formatCss,
} from "./color-utils";

describe("Color Utilities - Unit Tests", () => {
  // RGB to HEX変換の具体例
  describe("rgbToHex - 具体的な色の変換", () => {
    it("赤色 RGB(255, 0, 0) を #FF0000 に変換する", () => {
      expect(rgbToHex(255, 0, 0)).toBe("#FF0000");
    });

    it("緑色 RGB(0, 255, 0) を #00FF00 に変換する", () => {
      expect(rgbToHex(0, 255, 0)).toBe("#00FF00");
    });

    it("青色 RGB(0, 0, 255) を #0000FF に変換する", () => {
      expect(rgbToHex(0, 0, 255)).toBe("#0000FF");
    });

    it("黒色 RGB(0, 0, 0) を #000000 に変換する", () => {
      expect(rgbToHex(0, 0, 0)).toBe("#000000");
    });

    it("白色 RGB(255, 255, 255) を #FFFFFF に変換する", () => {
      expect(rgbToHex(255, 255, 255)).toBe("#FFFFFF");
    });

    it("グレー RGB(128, 128, 128) を #808080 に変換する", () => {
      expect(rgbToHex(128, 128, 128)).toBe("#808080");
    });
  });

  // HEX to RGB変換の具体例
  describe("hexToRgb - 具体的な色の変換", () => {
    it("#FF0000 を赤色 RGB(255, 0, 0) に変換する", () => {
      expect(hexToRgb("#FF0000")).toEqual({ r: 255, g: 0, b: 0 });
    });

    it("#00FF00 を緑色 RGB(0, 255, 0) に変換する", () => {
      expect(hexToRgb("#00FF00")).toEqual({ r: 0, g: 255, b: 0 });
    });

    it("#0000FF を青色 RGB(0, 0, 255) に変換する", () => {
      expect(hexToRgb("#0000FF")).toEqual({ r: 0, g: 0, b: 255 });
    });

    it("#000000 を黒色 RGB(0, 0, 0) に変換する", () => {
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("#FFFFFF を白色 RGB(255, 255, 255) に変換する", () => {
      expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("3桁のHEX #F00 を赤色 RGB(255, 0, 0) に変換する", () => {
      expect(hexToRgb("#F00")).toEqual({ r: 255, g: 0, b: 0 });
    });

    it("#なしのHEX FF0000 を赤色 RGB(255, 0, 0) に変換する", () => {
      expect(hexToRgb("FF0000")).toEqual({ r: 255, g: 0, b: 0 });
    });
  });

  // 境界値のテスト
  describe("境界値のテスト", () => {
    it("RGB最小値 (0, 0, 0) を正しく処理する", () => {
      expect(rgbToHex(0, 0, 0)).toBe("#000000");
      expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("RGB最大値 (255, 255, 255) を正しく処理する", () => {
      expect(rgbToHex(255, 255, 255)).toBe("#FFFFFF");
      expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("CMYK最小値 (0, 0, 0, 0) を正しく処理する", () => {
      const rgb = cmykToRgb(0, 0, 0, 0);
      expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
    });

    it("CMYK最大値 (0, 0, 0, 100) を正しく処理する", () => {
      const rgb = cmykToRgb(0, 0, 0, 100);
      expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("HSL Hue最小値 (0, 100, 50) を正しく処理する", () => {
      const rgb = hslToRgb(0, 100, 50);
      expect(rgb.r).toBe(255);
      expect(rgb.g).toBe(0);
      expect(rgb.b).toBe(0);
    });

    it("HSL Hue最大値 (360, 100, 50) を正しく処理する", () => {
      const rgb = hslToRgb(360, 100, 50);
      expect(rgb.r).toBe(255);
      expect(rgb.g).toBe(0);
      expect(rgb.b).toBe(0);
    });
  });

  // 無効な入力のエラーハンドリング (Requirements: 3.6)
  describe("無効なカラーコードのエラーハンドリング", () => {
    describe("rgbToHex - 範囲外の値", () => {
      it("RGB値が負の数の場合エラーをスローする", () => {
        expect(() => rgbToHex(-1, 0, 0)).toThrow(
          "RGB values must be integers between 0 and 255",
        );
      });

      it("RGB値が255を超える場合エラーをスローする", () => {
        expect(() => rgbToHex(256, 0, 0)).toThrow(
          "RGB values must be integers between 0 and 255",
        );
      });

      it("RGB値がNaNの場合エラーをスローする", () => {
        expect(() => rgbToHex(NaN, 0, 0)).toThrow(
          "RGB values must be integers between 0 and 255",
        );
      });
    });

    describe("hexToRgb - 不正なHEX形式", () => {
      it("無効なHEX文字列の場合nullを返す", () => {
        expect(hexToRgb("invalid")).toBeNull();
      });

      it("不正な文字を含むHEXの場合nullを返す", () => {
        expect(hexToRgb("#GGGGGG")).toBeNull();
      });

      it("長さが不正なHEXの場合nullを返す", () => {
        expect(hexToRgb("#FF")).toBeNull();
        expect(hexToRgb("#FFFFFFF")).toBeNull();
      });

      it("空文字列の場合nullを返す", () => {
        expect(hexToRgb("")).toBeNull();
      });

      it("nullの場合nullを返す", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(hexToRgb(null as any)).toBeNull();
      });
    });

    describe("rgbToCmyk - 範囲外の値", () => {
      it("RGB値が負の数の場合エラーをスローする", () => {
        expect(() => rgbToCmyk(-1, 0, 0)).toThrow(
          "RGB values must be integers between 0 and 255",
        );
      });

      it("RGB値が255を超える場合エラーをスローする", () => {
        expect(() => rgbToCmyk(256, 0, 0)).toThrow(
          "RGB values must be integers between 0 and 255",
        );
      });
    });

    describe("cmykToRgb - 範囲外の値", () => {
      it("CMYK値が負の数の場合エラーをスローする", () => {
        expect(() => cmykToRgb(-1, 0, 0, 0)).toThrow(
          "CMYK values must be numbers between 0 and 100",
        );
      });

      it("CMYK値が100を超える場合エラーをスローする", () => {
        expect(() => cmykToRgb(101, 0, 0, 0)).toThrow(
          "CMYK values must be numbers between 0 and 100",
        );
      });

      it("CMYK値がNaNの場合エラーをスローする", () => {
        expect(() => cmykToRgb(NaN, 0, 0, 0)).toThrow(
          "CMYK values must be numbers between 0 and 100",
        );
      });
    });

    describe("rgbToHsl - 範囲外の値", () => {
      it("RGB値が負の数の場合エラーをスローする", () => {
        expect(() => rgbToHsl(-1, 0, 0)).toThrow(
          "RGB values must be integers between 0 and 255",
        );
      });

      it("RGB値が255を超える場合エラーをスローする", () => {
        expect(() => rgbToHsl(256, 0, 0)).toThrow(
          "RGB values must be integers between 0 and 255",
        );
      });
    });

    describe("hslToRgb - 範囲外の値", () => {
      it("Hue値が負の数の場合エラーをスローする", () => {
        expect(() => hslToRgb(-1, 50, 50)).toThrow(
          "HSL values must be valid (h: 0-360, s: 0-100, l: 0-100)",
        );
      });

      it("Hue値が360を超える場合エラーをスローする", () => {
        expect(() => hslToRgb(361, 50, 50)).toThrow(
          "HSL values must be valid (h: 0-360, s: 0-100, l: 0-100)",
        );
      });

      it("Saturation値が負の数の場合エラーをスローする", () => {
        expect(() => hslToRgb(180, -1, 50)).toThrow(
          "HSL values must be valid (h: 0-360, s: 0-100, l: 0-100)",
        );
      });

      it("Saturation値が100を超える場合エラーをスローする", () => {
        expect(() => hslToRgb(180, 101, 50)).toThrow(
          "HSL values must be valid (h: 0-360, s: 0-100, l: 0-100)",
        );
      });

      it("Lightness値が負の数の場合エラーをスローする", () => {
        expect(() => hslToRgb(180, 50, -1)).toThrow(
          "HSL values must be valid (h: 0-360, s: 0-100, l: 0-100)",
        );
      });

      it("Lightness値が100を超える場合エラーをスローする", () => {
        expect(() => hslToRgb(180, 50, 101)).toThrow(
          "HSL values must be valid (h: 0-360, s: 0-100, l: 0-100)",
        );
      });
    });

    describe("formatCss - 不正な入力", () => {
      it("RGB形式で値が不足している場合エラーをスローする", () => {
        expect(() => formatCss({}, "rgb")).toThrow(
          "RGB values are required for rgb format",
        );
      });

      it("RGBA形式で値が不足している場合エラーをスローする", () => {
        expect(() => formatCss({}, "rgba")).toThrow(
          "ARGB values are required for rgba format",
        );
      });

      it("HEX形式で値が不足している場合エラーをスローする", () => {
        expect(() => formatCss({}, "hex")).toThrow(
          "HEX value is required for hex format",
        );
      });

      it("HSL形式で値が不足している場合エラーをスローする", () => {
        expect(() => formatCss({}, "hsl")).toThrow(
          "HSL values are required for hsl format",
        );
      });

      it("サポートされていない形式の場合エラーをスローする", () => {
        expect(() =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatCss({ rgb: { r: 0, g: 0, b: 0 } }, "invalid" as any),
        ).toThrow("Unsupported CSS format: invalid");
      });
    });
  });

  // validateColorValue関数のテスト
  describe("validateColorValue", () => {
    it("有効なRGB値を正しく検証する", () => {
      expect(validateColorValue(0, "rgb")).toBe(true);
      expect(validateColorValue(128, "rgb")).toBe(true);
      expect(validateColorValue(255, "rgb")).toBe(true);
    });

    it("無効なRGB値を正しく検証する", () => {
      expect(validateColorValue(-1, "rgb")).toBe(false);
      expect(validateColorValue(256, "rgb")).toBe(false);
      expect(validateColorValue(127.5, "rgb")).toBe(false); // 整数でない
      expect(validateColorValue(NaN, "rgb")).toBe(false);
    });

    it("有効なCMYK値を正しく検証する", () => {
      expect(validateColorValue(0, "cmyk")).toBe(true);
      expect(validateColorValue(50, "cmyk")).toBe(true);
      expect(validateColorValue(100, "cmyk")).toBe(true);
    });

    it("無効なCMYK値を正しく検証する", () => {
      expect(validateColorValue(-1, "cmyk")).toBe(false);
      expect(validateColorValue(101, "cmyk")).toBe(false);
      expect(validateColorValue(NaN, "cmyk")).toBe(false);
    });

    it("有効なHSL Hue値を正しく検証する", () => {
      expect(validateColorValue(0, "hsl-h")).toBe(true);
      expect(validateColorValue(180, "hsl-h")).toBe(true);
      expect(validateColorValue(360, "hsl-h")).toBe(true);
    });

    it("無効なHSL Hue値を正しく検証する", () => {
      expect(validateColorValue(-1, "hsl-h")).toBe(false);
      expect(validateColorValue(361, "hsl-h")).toBe(false);
      expect(validateColorValue(NaN, "hsl-h")).toBe(false);
    });

    it("有効なHSL Saturation/Lightness値を正しく検証する", () => {
      expect(validateColorValue(0, "hsl-sl")).toBe(true);
      expect(validateColorValue(50, "hsl-sl")).toBe(true);
      expect(validateColorValue(100, "hsl-sl")).toBe(true);
    });

    it("無効なHSL Saturation/Lightness値を正しく検証する", () => {
      expect(validateColorValue(-1, "hsl-sl")).toBe(false);
      expect(validateColorValue(101, "hsl-sl")).toBe(false);
      expect(validateColorValue(NaN, "hsl-sl")).toBe(false);
    });
  });

  // CSS形式変換の具体例
  describe("formatCss - 具体的な変換例", () => {
    it("赤色をRGB形式のCSSに変換する", () => {
      expect(formatCss({ rgb: { r: 255, g: 0, b: 0 } }, "rgb")).toBe(
        "rgb(255, 0, 0)",
      );
    });

    it("半透明の赤色をRGBA形式のCSSに変換する", () => {
      expect(formatCss({ argb: { a: 128, r: 255, g: 0, b: 0 } }, "rgba")).toBe(
        "rgba(255, 0, 0, 0.5)",
      );
    });

    it("赤色をHEX形式のCSSに変換する", () => {
      expect(formatCss({ hex: "#FF0000" }, "hex")).toBe("#FF0000");
    });

    it("赤色をHSL形式のCSSに変換する", () => {
      expect(formatCss({ hsl: { h: 0, s: 100, l: 50 } }, "hsl")).toBe(
        "hsl(0, 100%, 50%)",
      );
    });
  });

  // RGB-CMYK変換の具体例
  describe("RGB-CMYK変換の具体例", () => {
    it("赤色 RGB(255, 0, 0) をCMYKに変換する", () => {
      const cmyk = rgbToCmyk(255, 0, 0);
      expect(cmyk.c).toBe(0);
      expect(cmyk.m).toBe(100);
      expect(cmyk.y).toBe(100);
      expect(cmyk.k).toBe(0);
    });

    it("黒色 RGB(0, 0, 0) をCMYKに変換する", () => {
      const cmyk = rgbToCmyk(0, 0, 0);
      expect(cmyk.c).toBe(0);
      expect(cmyk.m).toBe(0);
      expect(cmyk.y).toBe(0);
      expect(cmyk.k).toBe(100);
    });

    it("白色 RGB(255, 255, 255) をCMYKに変換する", () => {
      const cmyk = rgbToCmyk(255, 255, 255);
      expect(cmyk.c).toBe(0);
      expect(cmyk.m).toBe(0);
      expect(cmyk.y).toBe(0);
      expect(cmyk.k).toBe(0);
    });
  });

  // RGB-HSL変換の具体例
  describe("RGB-HSL変換の具体例", () => {
    it("赤色 RGB(255, 0, 0) をHSLに変換する", () => {
      const hsl = rgbToHsl(255, 0, 0);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });

    it("黒色 RGB(0, 0, 0) をHSLに変換する", () => {
      const hsl = rgbToHsl(0, 0, 0);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(0);
      expect(hsl.l).toBe(0);
    });

    it("白色 RGB(255, 255, 255) をHSLに変換する", () => {
      const hsl = rgbToHsl(255, 255, 255);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(0);
      expect(hsl.l).toBe(100);
    });

    it("グレー RGB(128, 128, 128) をHSLに変換する", () => {
      const hsl = rgbToHsl(128, 128, 128);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(0);
      expect(hsl.l).toBeCloseTo(50.2, 1);
    });
  });
});
