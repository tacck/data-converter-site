/**
 * 日時変換ユーティリティ関数
 *
 * 日時形式とUnix Time(エポックタイム)の相互変換を提供します。
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5
 */

/**
 * 日時文字列をDateオブジェクトにパースします
 *
 * @param input - 日時文字列
 * @param format - 'standard' (YYYY/mm/DD HH:MM:SS) または 'iso' (ISO 8601)
 * @returns パースされたDateオブジェクト、無効な場合はnull
 */
export function parseDateTime(
  input: string,
  format: "standard" | "iso",
): Date | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  try {
    if (format === "iso") {
      const date = new Date(input);
      return isNaN(date.getTime()) ? null : date;
    }

    // standard形式: YYYY/mm/DD HH:MM:SS
    const standardRegex =
      /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
    const match = input.match(standardRegex);

    if (!match) {
      return null;
    }

    const [, year, month, day, hour, minute, second] = match;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // 月は0始まり
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    );

    // 無効な日付をチェック
    if (isNaN(date.getTime())) {
      return null;
    }

    // 入力値と実際の日付が一致するかチェック(例: 2024/02/30は無効)
    if (
      date.getFullYear() !== parseInt(year) ||
      date.getMonth() !== parseInt(month) - 1 ||
      date.getDate() !== parseInt(day) ||
      date.getHours() !== parseInt(hour) ||
      date.getMinutes() !== parseInt(minute) ||
      date.getSeconds() !== parseInt(second)
    ) {
      return null;
    }

    return date;
  } catch {
    return null;
  }
}

/**
 * DateオブジェクトをUnix Timeに変換します
 *
 * @param date - 変換するDateオブジェクト
 * @param unit - 'seconds' または 'milliseconds'
 * @returns Unix Time値
 */
export function toUnixTime(
  date: Date,
  unit: "seconds" | "milliseconds",
): number {
  const timestamp = date.getTime();

  if (isNaN(timestamp)) {
    throw new Error("Invalid date object");
  }

  return unit === "seconds" ? Math.floor(timestamp / 1000) : timestamp;
}

/**
 * Unix TimeをDateオブジェクトに変換します
 *
 * @param timestamp - Unix Time値
 * @param unit - 'seconds' または 'milliseconds'
 * @returns 変換されたDateオブジェクト
 */
export function fromUnixTime(
  timestamp: number,
  unit: "seconds" | "milliseconds",
): Date {
  if (typeof timestamp !== "number" || isNaN(timestamp)) {
    throw new Error("Invalid timestamp");
  }

  const milliseconds = unit === "seconds" ? timestamp * 1000 : timestamp;
  const date = new Date(milliseconds);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid timestamp value");
  }

  return date;
}

/**
 * Dateオブジェクトを指定された形式とタイムゾーンで文字列にフォーマットします
 *
 * @param date - フォーマットするDateオブジェクト
 * @param format - 'standard' (YYYY/mm/DD HH:MM:SS) または 'iso' (ISO 8601)
 * @param timezone - タイムゾーン識別子 (例: 'Asia/Tokyo', 'UTC')
 * @returns フォーマットされた日時文字列
 */
export function formatDateTime(
  date: Date,
  format: "standard" | "iso",
  timezone: string,
): string {
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date object");
  }

  try {
    if (format === "iso") {
      return date
        .toLocaleString("en-US", {
          timeZone: timezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(
          /(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+):(\d+)/,
          "$3-$1-$2T$4:$5:$6",
        );
    }

    // standard形式: YYYY/mm/DD HH:MM:SS
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(date);

    const getValue = (type: string) =>
      parts.find((p) => p.type === type)?.value || "";

    const year = getValue("year");
    const month = getValue("month");
    const day = getValue("day");
    const hour = getValue("hour");
    const minute = getValue("minute");
    const second = getValue("second");

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  } catch {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
}

/**
 * 日時文字列が有効かどうかを検証します
 *
 * @param input - 検証する日時文字列
 * @returns 有効な場合true、無効な場合false
 */
export function validateDateTime(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  // standard形式をチェック
  const standardRegex = /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
  if (standardRegex.test(input)) {
    return parseDateTime(input, "standard") !== null;
  }

  // ISO形式をチェック
  const date = new Date(input);
  return !isNaN(date.getTime());
}
