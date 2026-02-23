/**
 * バリデーションユーティリティ関数
 *
 * 日時とカラーコードのバリデーション、エラーメッセージ生成を提供します。
 * Requirements: 1.5, 2.5, 3.6, 9.1, 9.2
 */

import { validateDateTime } from "./datetime-utils";
import { validateColorValue, hexToRgb } from "./color-utils";

/**
 * バリデーション結果の型定義
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * 日時文字列のバリデーション
 *
 * @param input - 検証する日時文字列
 * @param format - 'standard' (YYYY/mm/DD HH:MM:SS) または 'iso' (ISO 8601)
 * @returns バリデーション結果
 */
export function validateDateTimeInput(
  input: string,
  format: "standard" | "iso",
): ValidationResult {
  if (!input || typeof input !== "string" || input.trim() === "") {
    return {
      isValid: false,
      errorMessage: "日時を入力してください。",
    };
  }

  const isValid = validateDateTime(input);

  if (!isValid) {
    if (format === "standard") {
      return {
        isValid: false,
        errorMessage:
          "無効な日時形式です。YYYY/mm/DD HH:MM:SS形式で入力してください。",
      };
    } else {
      return {
        isValid: false,
        errorMessage: "無効な日時形式です。ISO 8601形式で入力してください。",
      };
    }
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * Unix Time値のバリデーション
 *
 * @param input - 検証するUnix Time文字列
 * @param unit - 'seconds' または 'milliseconds'
 * @returns バリデーション結果
 */
export function validateUnixTimeInput(
  input: string,
  unit: "seconds" | "milliseconds",
): ValidationResult {
  if (!input || typeof input !== "string" || input.trim() === "") {
    return {
      isValid: false,
      errorMessage: "Unix Time値を入力してください。",
    };
  }

  const value = Number(input);

  if (isNaN(value)) {
    return {
      isValid: false,
      errorMessage: "無効なUnix Time値です。数値を入力してください。",
    };
  }

  // Unix Timeの妥当な範囲をチェック
  // 1970-01-01から2100-12-31までの範囲
  const minTimestamp = 0;
  const maxTimestamp = unit === "seconds" ? 4133894400 : 4133894400000; // 2100-12-31

  if (value < minTimestamp || value > maxTimestamp) {
    return {
      isValid: false,
      errorMessage: "Unix Time値が有効な範囲外です。",
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * RGB値のバリデーション
 *
 * @param r - Red値
 * @param g - Green値
 * @param b - Blue値
 * @returns バリデーション結果
 */
export function validateRgbInput(
  r: number,
  g: number,
  b: number,
): ValidationResult {
  if (!validateColorValue(r, "rgb")) {
    return {
      isValid: false,
      errorMessage: "Red値は0-255の整数で入力してください。",
    };
  }

  if (!validateColorValue(g, "rgb")) {
    return {
      isValid: false,
      errorMessage: "Green値は0-255の整数で入力してください。",
    };
  }

  if (!validateColorValue(b, "rgb")) {
    return {
      isValid: false,
      errorMessage: "Blue値は0-255の整数で入力してください。",
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * ARGB値のバリデーション
 *
 * @param a - Alpha値
 * @param r - Red値
 * @param g - Green値
 * @param b - Blue値
 * @returns バリデーション結果
 */
export function validateArgbInput(
  a: number,
  r: number,
  g: number,
  b: number,
): ValidationResult {
  if (!validateColorValue(a, "rgb")) {
    return {
      isValid: false,
      errorMessage: "Alpha値は0-255の整数で入力してください。",
    };
  }

  return validateRgbInput(r, g, b);
}

/**
 * HEX形式のバリデーション
 *
 * @param hex - HEX形式の文字列
 * @returns バリデーション結果
 */
export function validateHexInput(hex: string): ValidationResult {
  if (!hex || typeof hex !== "string" || hex.trim() === "") {
    return {
      isValid: false,
      errorMessage: "HEX値を入力してください。",
    };
  }

  const cleanHex = hex.trim().replace(/^#/, "");

  // 3桁または6桁のHEXをチェック
  if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return {
      isValid: false,
      errorMessage:
        "無効なHEX形式です。#RRGGBB または #RGB形式で入力してください。",
    };
  }

  // hexToRgbで実際に変換できるかチェック
  const rgb = hexToRgb(hex);
  if (rgb === null) {
    return {
      isValid: false,
      errorMessage: "無効なHEX値です。",
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * CMYK値のバリデーション
 *
 * @param c - Cyan値
 * @param m - Magenta値
 * @param y - Yellow値
 * @param k - Key(黒)値
 * @returns バリデーション結果
 */
export function validateCmykInput(
  c: number,
  m: number,
  y: number,
  k: number,
): ValidationResult {
  if (!validateColorValue(c, "cmyk")) {
    return {
      isValid: false,
      errorMessage: "Cyan値は0-100の範囲で入力してください。",
    };
  }

  if (!validateColorValue(m, "cmyk")) {
    return {
      isValid: false,
      errorMessage: "Magenta値は0-100の範囲で入力してください。",
    };
  }

  if (!validateColorValue(y, "cmyk")) {
    return {
      isValid: false,
      errorMessage: "Yellow値は0-100の範囲で入力してください。",
    };
  }

  if (!validateColorValue(k, "cmyk")) {
    return {
      isValid: false,
      errorMessage: "Key値は0-100の範囲で入力してください。",
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * HSL値のバリデーション
 *
 * @param h - Hue値
 * @param s - Saturation値
 * @param l - Lightness値
 * @returns バリデーション結果
 */
export function validateHslInput(
  h: number,
  s: number,
  l: number,
): ValidationResult {
  if (!validateColorValue(h, "hsl-h")) {
    return {
      isValid: false,
      errorMessage: "Hue値は0-360の範囲で入力してください。",
    };
  }

  if (!validateColorValue(s, "hsl-sl")) {
    return {
      isValid: false,
      errorMessage: "Saturation値は0-100の範囲で入力してください。",
    };
  }

  if (!validateColorValue(l, "hsl-sl")) {
    return {
      isValid: false,
      errorMessage: "Lightness値は0-100の範囲で入力してください。",
    };
  }

  return {
    isValid: true,
    errorMessage: null,
  };
}

/**
 * 汎用的なエラーメッセージ生成
 *
 * @param errorType - エラーの種類
 * @param context - エラーのコンテキスト情報
 * @returns エラーメッセージ
 */
export function generateErrorMessage(
  errorType: "validation" | "conversion" | "system",
  context?: string,
): string {
  switch (errorType) {
    case "validation":
      return context ? `入力値が無効です: ${context}` : "入力値が無効です。";
    case "conversion":
      return context
        ? `変換中にエラーが発生しました: ${context}`
        : "変換中にエラーが発生しました。入力値を確認してください。";
    case "system":
      return "予期しないエラーが発生しました。ページを再読み込みしてください。";
    default:
      return "エラーが発生しました。";
  }
}
