/**
 * 日時変換ユーティリティのテスト
 */

import {
  parseDateTime,
  toUnixTime,
  fromUnixTime,
  formatDateTime,
  validateDateTime,
} from "./datetime-utils";

describe("parseDateTime", () => {
  it("should parse standard format (YYYY/mm/DD HH:MM:SS)", () => {
    const result = parseDateTime("2024/01/01 00:00:00", "standard");
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2024);
    expect(result?.getMonth()).toBe(0); // 0-indexed
    expect(result?.getDate()).toBe(1);
  });

  it("should parse ISO format", () => {
    const result = parseDateTime("2024-01-01T00:00:00Z", "iso");
    expect(result).toBeInstanceOf(Date);
    expect(result).not.toBeNull();
  });

  it("should return null for invalid standard format", () => {
    expect(parseDateTime("invalid", "standard")).toBeNull();
    expect(parseDateTime("2024/13/01 00:00:00", "standard")).toBeNull();
    expect(parseDateTime("2024/02/30 00:00:00", "standard")).toBeNull();
  });

  it("should return null for invalid ISO format", () => {
    expect(parseDateTime("invalid-iso", "iso")).toBeNull();
  });

  it("should return null for empty input", () => {
    expect(parseDateTime("", "standard")).toBeNull();
    expect(parseDateTime("", "iso")).toBeNull();
  });
});

describe("toUnixTime", () => {
  it("should convert date to unix time in seconds", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const result = toUnixTime(date, "seconds");
    expect(result).toBe(1704067200);
  });

  it("should convert date to unix time in milliseconds", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const result = toUnixTime(date, "milliseconds");
    expect(result).toBe(1704067200000);
  });

  it("should handle epoch time (1970-01-01)", () => {
    const date = new Date("1970-01-01T00:00:00Z");
    const result = toUnixTime(date, "seconds");
    expect(result).toBe(0);
  });

  it("should throw error for invalid date", () => {
    const invalidDate = new Date("invalid");
    expect(() => toUnixTime(invalidDate, "seconds")).toThrow(
      "Invalid date object",
    );
  });
});

describe("fromUnixTime", () => {
  it("should convert unix time (seconds) to date", () => {
    const result = fromUnixTime(1704067200, "seconds");
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("should convert unix time (milliseconds) to date", () => {
    const result = fromUnixTime(1704067200000, "milliseconds");
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2024-01-01T00:00:00.000Z");
  });

  it("should handle epoch time (0)", () => {
    const result = fromUnixTime(0, "seconds");
    expect(result.toISOString()).toBe("1970-01-01T00:00:00.000Z");
  });

  it("should throw error for invalid timestamp", () => {
    expect(() => fromUnixTime(NaN, "seconds")).toThrow("Invalid timestamp");
  });
});

describe("formatDateTime", () => {
  it("should format date in standard format with UTC timezone", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const result = formatDateTime(date, "standard", "UTC");
    expect(result).toBe("2024/01/01 00:00:00");
  });

  it("should format date in ISO format with UTC timezone", () => {
    const date = new Date("2024-01-01T12:30:45Z");
    const result = formatDateTime(date, "iso", "UTC");
    expect(result).toContain("2024");
    expect(result).toContain("12:30:45");
  });

  it("should format date with different timezone (Asia/Tokyo)", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const result = formatDateTime(date, "standard", "Asia/Tokyo");
    expect(result).toBe("2024/01/01 09:00:00"); // UTC+9
  });

  it("should throw error for invalid date", () => {
    const invalidDate = new Date("invalid");
    expect(() => formatDateTime(invalidDate, "standard", "UTC")).toThrow(
      "Invalid date object",
    );
  });

  it("should throw error for invalid timezone", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    expect(() => formatDateTime(date, "standard", "Invalid/Timezone")).toThrow(
      "Invalid timezone",
    );
  });
});

describe("validateDateTime", () => {
  it("should validate correct standard format", () => {
    expect(validateDateTime("2024/01/01 00:00:00")).toBe(true);
    expect(validateDateTime("2024/12/31 23:59:59")).toBe(true);
  });

  it("should validate correct ISO format", () => {
    expect(validateDateTime("2024-01-01T00:00:00Z")).toBe(true);
    expect(validateDateTime("2024-01-01T12:30:45.000Z")).toBe(true);
  });

  it("should invalidate incorrect formats", () => {
    expect(validateDateTime("invalid")).toBe(false);
    expect(validateDateTime("2024/13/01 00:00:00")).toBe(false);
    expect(validateDateTime("2024/02/30 00:00:00")).toBe(false);
    expect(validateDateTime("")).toBe(false);
  });
});

describe("Round trip conversion", () => {
  it("should preserve datetime through unix time conversion", () => {
    const originalDate = new Date("2024-06-15T12:30:45Z");
    const unixTime = toUnixTime(originalDate, "seconds");
    const convertedDate = fromUnixTime(unixTime, "seconds");

    expect(convertedDate.getTime()).toBe(originalDate.getTime());
  });

  it("should preserve datetime with milliseconds unit", () => {
    const originalDate = new Date("2024-06-15T12:30:45.123Z");
    const unixTime = toUnixTime(originalDate, "milliseconds");
    const convertedDate = fromUnixTime(unixTime, "milliseconds");

    expect(convertedDate.getTime()).toBe(originalDate.getTime());
  });
});

describe("Unit conversion consistency", () => {
  it("should maintain consistency between seconds and milliseconds", () => {
    const date = new Date("2024-06-15T12:30:45Z");
    const seconds = toUnixTime(date, "seconds");
    const milliseconds = toUnixTime(date, "milliseconds");

    expect(seconds * 1000).toBe(milliseconds);
  });
});
