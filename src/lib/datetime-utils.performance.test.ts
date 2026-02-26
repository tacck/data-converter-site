/**
 * 日時変換ユーティリティのパフォーマンステスト
 * Requirements: 10.1 - 100ミリ秒以内の応答を確認
 */

import {
  parseDateTime,
  toUnixTime,
  fromUnixTime,
  formatDateTime,
} from "./datetime-utils";

describe("DateTime Utils - Performance Tests", () => {
  describe("Requirements 10.1: 100ミリ秒以内の応答", () => {
    it("日時からUnix Timeへの変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        "2024/01/01 00:00:00",
        "2024/06/15 12:30:45",
        "2024/12/31 23:59:59",
        "2023/03/20 08:15:30",
        "2025/07/04 16:45:00",
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        const date = parseDateTime(testCase, "standard");
        if (date) {
          toUnixTime(date, "seconds");
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("Unix Timeから日時への変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        1704067200, 1718453445, 1735689599, 1679299530, 1751990700,
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        const date = fromUnixTime(testCase, "seconds");
        formatDateTime(date, "standard", "UTC");

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("ミリ秒単位の変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        1704067200000, 1718453445000, 1735689599000, 1679299530000,
        1751990700000,
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        const date = fromUnixTime(testCase, "milliseconds");
        formatDateTime(date, "standard", "UTC");

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("タイムゾーン変換が100ミリ秒以内に完了する", () => {
      const timezones = [
        "UTC",
        "Asia/Tokyo",
        "America/New_York",
        "Europe/London",
      ];
      const unixTime = 1704067200;

      timezones.forEach((timezone) => {
        const startTime = performance.now();

        const date = fromUnixTime(unixTime, "seconds");
        formatDateTime(date, "standard", timezone);

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("ISO形式の変換が100ミリ秒以内に完了する", () => {
      const testCases = [
        "2024-01-01T00:00:00Z",
        "2024-06-15T12:30:45Z",
        "2024-12-31T23:59:59Z",
      ];

      testCases.forEach((testCase) => {
        const startTime = performance.now();

        const date = parseDateTime(testCase, "iso");
        if (date) {
          toUnixTime(date, "seconds");
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      });
    });

    it("100回の連続変換が各100ミリ秒以内に完了する", () => {
      for (let i = 0; i < 100; i++) {
        const startTime = performance.now();

        const date = parseDateTime("2024/01/01 00:00:00", "standard");
        if (date) {
          toUnixTime(date, "seconds");
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(100);
      }
    });
  });
});
