/**
 * カラー変換ユーティリティ関数
 *
 * RGB、ARGB、HEX、CMYK、HSL形式のカラーコード相互変換を提供します。
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 4.1, 4.2, 4.3, 4.4, 5.2, 5.3, 5.4, 5.5
 */

/**
 * RGB値をHEX形式に変換します
 *
 * @param r - Red値 (0-255)
 * @param g - Green値 (0-255)
 * @param b - Blue値 (0-255)
 * @returns HEX形式の文字列 (例: "#FF0000")
 * @throws 無効な値の場合エラー
 */
export function rgbToHex(r: number, g: number, b: number): string {
  // バリデーション
  if (
    !validateColorValue(r, "rgb") ||
    !validateColorValue(g, "rgb") ||
    !validateColorValue(b, "rgb")
  ) {
    throw new Error("RGB values must be integers between 0 and 255");
  }

  // 整数に変換
  const rInt = Math.round(r);
  const gInt = Math.round(g);
  const bInt = Math.round(b);

  // HEX形式に変換
  const toHex = (value: number): string => {
    const hex = value.toString(16).toUpperCase();
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(rInt)}${toHex(gInt)}${toHex(bInt)}`;
}

/**
 * HEX形式をRGB値に変換します
 *
 * @param hex - HEX形式の文字列 (例: "#FF0000" または "FF0000")
 * @returns RGB値のオブジェクト、無効な場合はnull
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  if (!hex || typeof hex !== "string") {
    return null;
  }

  // #を削除
  const cleanHex = hex.replace(/^#/, "");

  // 3桁または6桁のHEXをチェック
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return null;
  }

  // 3桁の場合は6桁に展開 (例: "F00" -> "FF0000")
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * RGB値をCMYK値に変換します
 *
 * @param r - Red値 (0-255)
 * @param g - Green値 (0-255)
 * @param b - Blue値 (0-255)
 * @returns CMYK値のオブジェクト (各値は0-100%)
 * @throws 無効な値の場合エラー
 */
export function rgbToCmyk(
  r: number,
  g: number,
  b: number,
): { c: number; m: number; y: number; k: number } {
  // バリデーション
  if (
    !validateColorValue(r, "rgb") ||
    !validateColorValue(g, "rgb") ||
    !validateColorValue(b, "rgb")
  ) {
    throw new Error("RGB values must be integers between 0 and 255");
  }

  // RGB値を0-1の範囲に正規化
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // K(黒)を計算
  const k = 1 - Math.max(rNorm, gNorm, bNorm);

  // 黒の場合はC=M=Y=0
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  // CMYを計算
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  // パーセンテージに変換して小数点第1位で四捨五入
  return {
    c: Math.round(c * 1000) / 10,
    m: Math.round(m * 1000) / 10,
    y: Math.round(y * 1000) / 10,
    k: Math.round(k * 1000) / 10,
  };
}

/**
 * CMYK値をRGB値に変換します
 *
 * @param c - Cyan値 (0-100%)
 * @param m - Magenta値 (0-100%)
 * @param y - Yellow値 (0-100%)
 * @param k - Key(黒)値 (0-100%)
 * @returns RGB値のオブジェクト
 * @throws 無効な値の場合エラー
 */
export function cmykToRgb(
  c: number,
  m: number,
  y: number,
  k: number,
): { r: number; g: number; b: number } {
  // バリデーション
  if (
    !validateColorValue(c, "cmyk") ||
    !validateColorValue(m, "cmyk") ||
    !validateColorValue(y, "cmyk") ||
    !validateColorValue(k, "cmyk")
  ) {
    throw new Error("CMYK values must be numbers between 0 and 100");
  }

  // CMYK値を0-1の範囲に正規化
  const cNorm = c / 100;
  const mNorm = m / 100;
  const yNorm = y / 100;
  const kNorm = k / 100;

  // RGBを計算
  const r = 255 * (1 - cNorm) * (1 - kNorm);
  const g = 255 * (1 - mNorm) * (1 - kNorm);
  const b = 255 * (1 - yNorm) * (1 - kNorm);

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

/**
 * RGB値をHSL値に変換します
 *
 * @param r - Red値 (0-255)
 * @param g - Green値 (0-255)
 * @param b - Blue値 (0-255)
 * @returns HSL値のオブジェクト (h: 0-360, s: 0-100%, l: 0-100%)
 * @throws 無効な値の場合エラー
 */
export function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  // バリデーション
  if (
    !validateColorValue(r, "rgb") ||
    !validateColorValue(g, "rgb") ||
    !validateColorValue(b, "rgb")
  ) {
    throw new Error("RGB values must be integers between 0 and 255");
  }

  // RGB値を0-1の範囲に正規化
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  // Lightnessを計算
  const l = (max + min) / 2;

  // Saturationを計算
  let s = 0;
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  }

  // Hueを計算
  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) / 6;
    } else if (max === gNorm) {
      h = ((bNorm - rNorm) / delta + 2) / 6;
    } else {
      h = ((rNorm - gNorm) / delta + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

/**
 * HSL値をRGB値に変換します
 *
 * @param h - Hue値 (0-360)
 * @param s - Saturation値 (0-100%)
 * @param l - Lightness値 (0-100%)
 * @returns RGB値のオブジェクト
 * @throws 無効な値の場合エラー
 */
export function hslToRgb(
  h: number,
  s: number,
  l: number,
): { r: number; g: number; b: number } {
  // バリデーション
  if (
    !validateColorValue(h, "hsl-h") ||
    !validateColorValue(s, "hsl-sl") ||
    !validateColorValue(l, "hsl-sl")
  ) {
    throw new Error("HSL values must be valid (h: 0-360, s: 0-100, l: 0-100)");
  }

  // HSL値を正規化
  const hNorm = ((h % 360) + 360) % 360; // 0-360の範囲に正規化
  const sNorm = s / 100;
  const lNorm = l / 100;

  // RGBを計算
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (hNorm >= 0 && hNorm < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hNorm >= 60 && hNorm < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hNorm >= 120 && hNorm < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hNorm >= 180 && hNorm < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hNorm >= 240 && hNorm < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * カラー値が有効かどうかを検証します
 *
 * @param value - 検証する値
 * @param format - カラー形式 ("rgb", "cmyk", "hsl-h", "hsl-sl")
 * @returns 有効な場合true、無効な場合false
 */
export function validateColorValue(
  value: number,
  format: "rgb" | "cmyk" | "hsl-h" | "hsl-sl",
): boolean {
  if (typeof value !== "number" || isNaN(value)) {
    return false;
  }

  switch (format) {
    case "rgb":
      return Number.isInteger(value) && value >= 0 && value <= 255;
    case "cmyk":
    case "hsl-sl":
      return value >= 0 && value <= 100;
    case "hsl-h":
      return value >= 0 && value <= 360;
    default:
      return false;
  }
}

/**
 * カラー値をCSS形式の文字列に変換します
 *
 * @param color - カラー値のオブジェクト
 * @param format - CSS形式 ("rgb", "rgba", "hex", "hsl")
 * @returns CSS形式の文字列
 * @throws 無効な値の場合エラー
 */
export function formatCss(
  color: {
    rgb?: { r: number; g: number; b: number };
    argb?: { a: number; r: number; g: number; b: number };
    hex?: string;
    hsl?: { h: number; s: number; l: number };
  },
  format: "rgb" | "rgba" | "hex" | "hsl",
): string {
  switch (format) {
    case "rgb":
      if (!color.rgb) {
        throw new Error("RGB values are required for rgb format");
      }
      // NaNチェック
      if (isNaN(color.rgb.r) || isNaN(color.rgb.g) || isNaN(color.rgb.b)) {
        throw new Error("Invalid RGB values: NaN detected");
      }
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;

    case "rgba":
      if (!color.argb) {
        throw new Error("ARGB values are required for rgba format");
      }
      // NaNチェック
      if (
        isNaN(color.argb.a) ||
        isNaN(color.argb.r) ||
        isNaN(color.argb.g) ||
        isNaN(color.argb.b)
      ) {
        throw new Error("Invalid ARGB values: NaN detected");
      }
      // Alpha値を0-1の範囲に正規化
      const alpha = Math.round((color.argb.a / 255) * 100) / 100;
      return `rgba(${color.argb.r}, ${color.argb.g}, ${color.argb.b}, ${alpha})`;

    case "hex":
      if (!color.hex) {
        throw new Error("HEX value is required for hex format");
      }
      return color.hex;

    case "hsl":
      if (!color.hsl) {
        throw new Error("HSL values are required for hsl format");
      }
      // NaNチェック
      if (isNaN(color.hsl.h) || isNaN(color.hsl.s) || isNaN(color.hsl.l)) {
        throw new Error("Invalid HSL values: NaN detected");
      }
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;

    default:
      throw new Error(`Unsupported CSS format: ${format}`);
  }
}
