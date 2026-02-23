/**
 * バリデーションユーティリティのユニットテスト
 */

import {
  validateDateTimeInput,
  validateUnixTimeInput,
  validateRgbInput,
  validateArgbInput,
  validateHexInput,
  validateCmykInput,
  validateHslInput,
  generateErrorMessage,
} from "./validation-utils";

describe("validateDateTimeInput", () => {
  it("有効なstandard形式の日時を受け入れる", () => {
    const result = validateDateTimeInput("2024/01/01 00:00:00", "standard");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("有効なISO形式の日時を受け入れる", () => {
    const result = validateDateTimeInput("2024-01-01T00:00:00Z", "iso");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("空文字列を拒否する", () => {
    const result = validateDateTimeInput("", "standard");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("日時を入力してください。");
  });

  it("無効なstandard形式を拒否する", () => {
    const result = validateDateTimeInput("invalid-format", "standard");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("YYYY/mm/DD HH:MM:SS");
  });

  it("無効なISO形式を拒否する", () => {
    const result = validateDateTimeInput("invalid-date", "iso");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("ISO 8601");
  });
});

describe("validateUnixTimeInput", () => {
  it("有効なUnix Time(秒)を受け入れる", () => {
    const result = validateUnixTimeInput("1704067200", "seconds");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("有効なUnix Time(ミリ秒)を受け入れる", () => {
    const result = validateUnixTimeInput("1704067200000", "milliseconds");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("空文字列を拒否する", () => {
    const result = validateUnixTimeInput("", "seconds");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("Unix Time値を入力してください。");
  });

  it("非数値を拒否する", () => {
    const result = validateUnixTimeInput("not-a-number", "seconds");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("数値を入力してください");
  });

  it("範囲外の値を拒否する", () => {
    const result = validateUnixTimeInput("9999999999", "seconds");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("有効な範囲外");
  });

  it("エポックタイム(0)を受け入れる", () => {
    const result = validateUnixTimeInput("0", "seconds");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });
});

describe("validateRgbInput", () => {
  it("有効なRGB値を受け入れる", () => {
    const result = validateRgbInput(255, 0, 0);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("境界値(0, 0, 0)を受け入れる", () => {
    const result = validateRgbInput(0, 0, 0);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("境界値(255, 255, 255)を受け入れる", () => {
    const result = validateRgbInput(255, 255, 255);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("範囲外のRed値を拒否する", () => {
    const result = validateRgbInput(256, 0, 0);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Red値");
  });

  it("範囲外のGreen値を拒否する", () => {
    const result = validateRgbInput(0, -1, 0);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Green値");
  });

  it("範囲外のBlue値を拒否する", () => {
    const result = validateRgbInput(0, 0, 300);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Blue値");
  });
});

describe("validateArgbInput", () => {
  it("有効なARGB値を受け入れる", () => {
    const result = validateArgbInput(255, 255, 0, 0);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("範囲外のAlpha値を拒否する", () => {
    const result = validateArgbInput(256, 255, 0, 0);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Alpha値");
  });

  it("範囲外のRGB値を拒否する", () => {
    const result = validateArgbInput(255, 256, 0, 0);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Red値");
  });
});

describe("validateHexInput", () => {
  it("有効な6桁HEX値を受け入れる", () => {
    const result = validateHexInput("#FF0000");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("有効な3桁HEX値を受け入れる", () => {
    const result = validateHexInput("#F00");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("#なしのHEX値を受け入れる", () => {
    const result = validateHexInput("FF0000");
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("空文字列を拒否する", () => {
    const result = validateHexInput("");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toBe("HEX値を入力してください。");
  });

  it("無効な文字を含むHEX値を拒否する", () => {
    const result = validateHexInput("#GGGGGG");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("無効なHEX形式");
  });

  it("無効な桁数のHEX値を拒否する", () => {
    const result = validateHexInput("#FF00");
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("無効なHEX形式");
  });
});

describe("validateCmykInput", () => {
  it("有効なCMYK値を受け入れる", () => {
    const result = validateCmykInput(0, 100, 100, 0);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("境界値(0, 0, 0, 0)を受け入れる", () => {
    const result = validateCmykInput(0, 0, 0, 0);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("境界値(100, 100, 100, 100)を受け入れる", () => {
    const result = validateCmykInput(100, 100, 100, 100);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("範囲外のCyan値を拒否する", () => {
    const result = validateCmykInput(101, 0, 0, 0);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Cyan値");
  });

  it("範囲外のMagenta値を拒否する", () => {
    const result = validateCmykInput(0, -1, 0, 0);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Magenta値");
  });
});

describe("validateHslInput", () => {
  it("有効なHSL値を受け入れる", () => {
    const result = validateHslInput(0, 100, 50);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("境界値(0, 0, 0)を受け入れる", () => {
    const result = validateHslInput(0, 0, 0);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("境界値(360, 100, 100)を受け入れる", () => {
    const result = validateHslInput(360, 100, 100);
    expect(result.isValid).toBe(true);
    expect(result.errorMessage).toBeNull();
  });

  it("範囲外のHue値を拒否する", () => {
    const result = validateHslInput(361, 50, 50);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Hue値");
  });

  it("範囲外のSaturation値を拒否する", () => {
    const result = validateHslInput(180, 101, 50);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Saturation値");
  });

  it("範囲外のLightness値を拒否する", () => {
    const result = validateHslInput(180, 50, -1);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain("Lightness値");
  });
});

describe("generateErrorMessage", () => {
  it("バリデーションエラーメッセージを生成する", () => {
    const message = generateErrorMessage("validation");
    expect(message).toContain("入力値が無効です");
  });

  it("コンテキスト付きバリデーションエラーメッセージを生成する", () => {
    const message = generateErrorMessage("validation", "RGB値が範囲外");
    expect(message).toContain("入力値が無効です: RGB値が範囲外");
  });

  it("変換エラーメッセージを生成する", () => {
    const message = generateErrorMessage("conversion");
    expect(message).toContain("変換中にエラーが発生しました");
  });

  it("コンテキスト付き変換エラーメッセージを生成する", () => {
    const message = generateErrorMessage("conversion", "CMYK変換失敗");
    expect(message).toContain("変換中にエラーが発生しました: CMYK変換失敗");
  });

  it("システムエラーメッセージを生成する", () => {
    const message = generateErrorMessage("system");
    expect(message).toContain("予期しないエラーが発生しました");
  });
});
