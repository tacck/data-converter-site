/**
 * DateTimeConverterコンポーネントのプロパティベーステスト
 *
 * Feature: data-converter-documentation
 * Properties: 11, 12, 13
 * Validates: Requirements 1.5, 2.5, 9.1, 9.4, 9.5
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { DateTimeConverter } from "./DateTimeConverter";

// テスト用のメッセージ
const messages = {
  datetime: {
    title: "DateTime Converter",
    toUnixTime: "DateTime to Unix Time",
    fromUnixTime: "Unix Time to DateTime",
    inputLabel: "Input",
    outputLabel: "Output",
    datetimeInput: "DateTime",
    unixTimeInput: "Unix Time",
    timezone: "Timezone",
    unit: "Unit",
    format: "Format",
    seconds: "Seconds",
    milliseconds: "Milliseconds",
    standard: "Standard (YYYY/mm/DD HH:MM:SS)",
    iso: "ISO 8601",
    convert: "Convert",
    placeholder: {
      datetime: "2024/01/01 12:00:00",
      unixTime: "1704067200",
    },
    description: {
      toUnixTime: "Convert human-readable datetime to Unix Time",
      fromUnixTime: "Convert Unix Time to human-readable datetime",
    },
  },
  errors: {
    invalidDateTime:
      "無効な日時形式です。YYYY/mm/DD HH:MM:SS形式で入力してください。",
    invalidUnixTime: "無効なUnix Time値です。数値を入力してください。",
    conversionError: "変換中にエラーが発生しました。入力値を確認してください。",
  },
};

// テストヘルパー: コンポーネントをレンダリング
function renderDateTimeConverter() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <DateTimeConverter />
    </NextIntlClientProvider>,
  );
}

describe("DateTimeConverter - Property-Based Tests", () => {
  // Feature: data-converter-documentation, Property 11: 無効な入力に対するエラーハンドリング(日時)
  describe("Property 11: Error Handling for Invalid DateTime Input", () => {
    it("should display error message for invalid datetime input", () => {
      const { container } = renderDateTimeConverter();

      // 日時入力フィールドを取得
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 無効な入力を入力
      fireEvent.change(datetimeInput, {
        target: { value: "invalid-datetime" },
      });

      // エラーメッセージが表示されることを確認
      const hasError = container.querySelector('[role="alert"]') !== null;
      expect(hasError).toBe(true);
    });

    it("should display error message for invalid Unix Time input", () => {
      const { container } = renderDateTimeConverter();

      // Unix Time入力フィールドを取得
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0];

      // 無効な入力を入力
      fireEvent.change(unixTimeInput, {
        target: { value: "not-a-number" },
      });

      // エラーメッセージが表示されることを確認
      const hasError = container.querySelector('[role="alert"]') !== null;
      expect(hasError).toBe(true);
    });
  });

  // Feature: data-converter-documentation, Property 12: エラーメッセージの動的更新
  describe("Property 12: Dynamic Error Message Updates", () => {
    it("should update error message in real-time when input changes", () => {
      const { container } = renderDateTimeConverter();

      // 日時入力フィールドを取得
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 無効な入力を入力
      fireEvent.change(datetimeInput, {
        target: { value: "invalid-datetime" },
      });

      // エラーが表示されることを確認
      expect(container.querySelector('[role="alert"]')).not.toBeNull();

      // 有効な入力に修正
      fireEvent.change(datetimeInput, {
        target: { value: "2024/01/01 12:00:00" },
      });

      // エラーが解除されることを確認
      expect(container.querySelector('[role="alert"]')).toBeNull();
    });
  });

  // Feature: data-converter-documentation, Property 13: 変換処理のエラーキャッチ
  describe("Property 13: Conversion Error Catching", () => {
    it("should not display errors for valid datetime inputs", () => {
      const { container } = renderDateTimeConverter();

      // 日時入力フィールドを取得
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 有効な入力
      fireEvent.change(datetimeInput, {
        target: { value: "2024/01/01 00:00:00" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[0]);

      // エラーが表示されないことを確認
      const hasError = container.querySelector('[role="alert"]') !== null;
      expect(hasError).toBe(false);
    });

    it("should handle conversion errors gracefully without crashing", () => {
      renderDateTimeConverter();

      // 日時入力フィールドを取得
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 極端な値を入力
      fireEvent.change(datetimeInput, {
        target: { value: "9999/12/31 23:59:59" },
      });

      // 変換ボタンをクリック（エラーが発生してもクラッシュしない）
      expect(() => {
        const convertButtons = screen.getAllByText("Convert");
        fireEvent.click(convertButtons[0]);
      }).not.toThrow();
    });
  });
});
