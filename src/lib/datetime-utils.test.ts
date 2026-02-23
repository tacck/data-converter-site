/**
 * 日時変換ユーティリティのユニットテスト
 *
 * 具体的な変換例、エッジケース、エラーハンドリングをテストします。
 * Requirements: 1.5, 2.5
 */

import {
  parseDateTime,
  toUnixTime,
  fromUnixTime,
  formatDateTime,
  validateDateTime,
} from "./datetime-utils";

describe("DateTimeUtils - Unit Tests", () => {
  // 具体的な変換例のテスト
  describe("具体的な日時の変換例", () => {
    it("2024-01-01 00:00:00 UTC を Unix Time 1704067200 に変換する", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = toUnixTime(date, "seconds");
      expect(result).toBe(1704067200);
    });

    it("Unix Time 1704067200 を 2024-01-01 00:00:00 UTC に変換する", () => {
      const result = fromUnixTime(1704067200, "seconds");
      expect(result.toISOString()).toBe("2024-01-01T00:00:00.000Z");
    });

    it("standard形式の日時文字列をパースする", () => {
      const result = parseDateTime("2024/01/01 12:30:45", "standard");
      expect(result).not.toBeNull();
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(0); // 0-indexed
      expect(result?.getDate()).toBe(1);
      expect(result?.getHours()).toBe(12);
      expect(result?.getMinutes()).toBe(30);
      expect(result?.getSeconds()).toBe(45);
    });

    it("ISO形式の日時文字列をパースする", () => {
      const result = parseDateTime("2024-01-01T12:30:45Z", "iso");
      expect(result).not.toBeNull();
      expect(result?.toISOString()).toBe("2024-01-01T12:30:45.000Z");
    });

    it("日時をstandard形式でフォーマットする", () => {
      const date = new Date("2024-01-01T12:30:45Z");
      const result = formatDateTime(date, "standard", "UTC");
      expect(result).toBe("2024/01/01 12:30:45");
    });

    it("タイムゾーンを考慮してフォーマットする (Asia/Tokyo)", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatDateTime(date, "standard", "Asia/Tokyo");
      expect(result).toBe("2024/01/01 09:00:00"); // UTC+9
    });

    it("ミリ秒単位でUnix Timeに変換する", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = toUnixTime(date, "milliseconds");
      expect(result).toBe(1704067200000);
    });

    it("ミリ秒単位のUnix Timeから日時に変換する", () => {
      const result = fromUnixTime(1704067200000, "milliseconds");
      expect(result.toISOString()).toBe("2024-01-01T00:00:00.000Z");
    });
  });

  // エッジケースのテスト
  describe("エッジケース", () => {
    it("エポックタイム (1970-01-01 00:00:00 UTC) を Unix Time 0 に変換する", () => {
      const date = new Date("1970-01-01T00:00:00Z");
      const result = toUnixTime(date, "seconds");
      expect(result).toBe(0);
    });

    it("Unix Time 0 をエポックタイムに変換する", () => {
      const result = fromUnixTime(0, "seconds");
      expect(result.toISOString()).toBe("1970-01-01T00:00:00.000Z");
    });

    it("秒とミリ秒の単位変換が一貫している", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const seconds = toUnixTime(date, "seconds");
      const milliseconds = toUnixTime(date, "milliseconds");
      expect(seconds * 1000).toBe(milliseconds);
    });

    it("タイムゾーンの境界値 (UTC+14)", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatDateTime(date, "standard", "Pacific/Kiritimati");
      expect(result).toBe("2024/01/01 14:00:00"); // UTC+14
    });

    it("タイムゾーンの境界値 (UTC-12)", () => {
      const date = new Date("2024-01-01T12:00:00Z");
      const result = formatDateTime(date, "standard", "Etc/GMT+12");
      expect(result).toBe("2024/01/01 00:00:00"); // UTC-12
    });

    it("月末の日付を正しく処理する", () => {
      const result = parseDateTime("2024/01/31 23:59:59", "standard");
      expect(result).not.toBeNull();
      expect(result?.getDate()).toBe(31);
    });

    it("うるう年の2月29日を正しく処理する", () => {
      const result = parseDateTime("2024/02/29 12:00:00", "standard");
      expect(result).not.toBeNull();
      expect(result?.getMonth()).toBe(1); // February
      expect(result?.getDate()).toBe(29);
    });

    it("年の境界 (12月31日 23:59:59)", () => {
      const result = parseDateTime("2024/12/31 23:59:59", "standard");
      expect(result).not.toBeNull();
      expect(result?.getMonth()).toBe(11); // December
      expect(result?.getDate()).toBe(31);
    });
  });

  // エラーハンドリングのテスト (Requirements 1.5, 2.5)
  describe("無効な日時形式のエラーハンドリング (Requirement 1.5)", () => {
    it("空文字列を拒否する", () => {
      const result = parseDateTime("", "standard");
      expect(result).toBeNull();
    });

    it("null/undefinedを拒否する", () => {
      const result1 = parseDateTime(null as any, "standard");
      const result2 = parseDateTime(undefined as any, "standard");
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });

    it("不正なフォーマットの文字列を拒否する", () => {
      const invalidFormats = [
        "2024-01-01 12:00:00", // ハイフン区切り
        "2024/1/1 12:00:00", // ゼロパディングなし
        "2024/01/01", // 時刻なし
        "12:00:00", // 日付なし
        "invalid date string",
        "2024/13/01 12:00:00", // 無効な月
        "2024/01/32 12:00:00", // 無効な日
        "2024/01/01 25:00:00", // 無効な時
        "2024/01/01 12:60:00", // 無効な分
        "2024/01/01 12:00:60", // 無効な秒
      ];

      invalidFormats.forEach((format) => {
        const result = parseDateTime(format, "standard");
        expect(result).toBeNull();
      });
    });

    it("存在しない日付を拒否する (2月30日)", () => {
      const result = parseDateTime("2024/02/30 12:00:00", "standard");
      expect(result).toBeNull();
    });

    it("うるう年でない年の2月29日を拒否する", () => {
      const result = parseDateTime("2023/02/29 12:00:00", "standard");
      expect(result).toBeNull();
    });

    it("ISO形式で無効な文字列を拒否する", () => {
      const result = parseDateTime("invalid-iso-date", "iso");
      expect(result).toBeNull();
    });

    it("validateDateTime が無効な日時を検出する", () => {
      expect(validateDateTime("")).toBe(false);
      expect(validateDateTime("invalid")).toBe(false);
      expect(validateDateTime("2024/13/01 12:00:00")).toBe(false);
      expect(validateDateTime("2024/02/30 12:00:00")).toBe(false);
    });

    it("validateDateTime が有効な日時を認識する", () => {
      expect(validateDateTime("2024/01/01 12:00:00")).toBe(true);
      expect(validateDateTime("2024-01-01T12:00:00Z")).toBe(true);
    });
  });

  describe("無効なUnix Time値のエラーハンドリング (Requirement 2.5)", () => {
    it("NaNを拒否する", () => {
      expect(() => fromUnixTime(NaN, "seconds")).toThrow("Invalid timestamp");
    });

    it("文字列を拒否する", () => {
      expect(() => fromUnixTime("invalid" as any, "seconds")).toThrow(
        "Invalid timestamp",
      );
    });

    it("null/undefinedを拒否する", () => {
      expect(() => fromUnixTime(null as any, "seconds")).toThrow(
        "Invalid timestamp",
      );
      expect(() => fromUnixTime(undefined as any, "seconds")).toThrow(
        "Invalid timestamp",
      );
    });

    it("無効なDateオブジェクトからのUnix Time変換でエラーを投げる", () => {
      const invalidDate = new Date("invalid");
      expect(() => toUnixTime(invalidDate, "seconds")).toThrow(
        "Invalid date object",
      );
    });

    it("無効なDateオブジェクトのフォーマットでエラーを投げる", () => {
      const invalidDate = new Date("invalid");
      expect(() => formatDateTime(invalidDate, "standard", "UTC")).toThrow(
        "Invalid date object",
      );
    });

    it("無効なタイムゾーンでエラーを投げる", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      expect(() =>
        formatDateTime(date, "standard", "Invalid/Timezone"),
      ).toThrow("Invalid timezone");
    });
  });

  // 範囲外の日時値のテスト
  describe("範囲外の日時値", () => {
    it("極端に大きなUnix Time値を処理する", () => {
      const largeTimestamp = 253402214400; // 9999-12-31 00:00:00 UTC
      const result = fromUnixTime(largeTimestamp, "seconds");
      expect(result.getFullYear()).toBe(9999);
    });

    it("極端に小さなUnix Time値を処理する", () => {
      const smallTimestamp = -2208988800; // 1900-01-01 00:00:00 UTC
      const result = fromUnixTime(smallTimestamp, "seconds");
      expect(result.getFullYear()).toBe(1900);
    });
  });

  // 不正なフォーマット指定のテスト
  describe("不正なフォーマット指定", () => {
    it("サポートされていないフォーマットを適切に処理する", () => {
      // TypeScriptの型システムで防がれるが、実行時の動作を確認
      const date = new Date("2024-01-01T00:00:00Z");
      const result = formatDateTime(date, "invalid" as any, "UTC");
      // 実装では'iso'以外はすべてstandard扱いになる
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });
});
