/**
 * DateTimeConverterコンポーネントのユニットテスト
 *
 * コンポーネントの統合テストとユーザーインタラクションのテスト
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
      "Invalid datetime format. Please use YYYY/mm/DD HH:MM:SS or ISO 8601 format.",
    invalidUnixTime: "Invalid Unix Time value. Please enter a number.",
    conversionError:
      "An error occurred during conversion. Please check your input.",
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

describe("DateTimeConverter", () => {
  describe("Component Rendering", () => {
    it("should render both conversion sections", () => {
      renderDateTimeConverter();

      expect(screen.getByText("DateTime to Unix Time")).toBeInTheDocument();
      expect(screen.getByText("Unix Time to DateTime")).toBeInTheDocument();
    });

    it("should render all input fields and controls", () => {
      renderDateTimeConverter();

      // 日時入力フィールド
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      expect(datetimeInputs).toHaveLength(1);

      // Unix Time入力フィールド
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      expect(unixTimeInputs).toHaveLength(1);

      // タイムゾーン選択
      expect(screen.getByLabelText("Timezone")).toBeInTheDocument();

      // 単位選択
      const unitSelects = screen.getAllByLabelText("Unit");
      expect(unitSelects.length).toBeGreaterThan(0);

      // 形式選択
      const formatSelects = screen.getAllByLabelText("Format");
      expect(formatSelects.length).toBeGreaterThan(0);

      // 変換ボタン
      const convertButtons = screen.getAllByText("Convert");
      expect(convertButtons.length).toBe(2);
    });
  });

  describe("DateTime to Unix Time Conversion", () => {
    // Requirement 1.1: YYYY/mm/DD HH:MM:SS形式の変換
    it("should convert standard format datetime to Unix Time (seconds)", () => {
      renderDateTimeConverter();

      // 日時入力フィールドを取得
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 日時を入力
      fireEvent.change(datetimeInput, {
        target: { value: "2024/01/01 00:00:00" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[0]);

      // Unix Time入力フィールドに結果が設定されることを確認（値は環境のタイムゾーンに依存）
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0] as HTMLInputElement;
      expect(unixTimeInput.value).toMatch(/^\d+$/);
      expect(parseInt(unixTimeInput.value)).toBeGreaterThan(0);
    });

    // Requirement 1.2: ISO形式の変換
    it("should convert ISO format datetime to Unix Time", () => {
      renderDateTimeConverter();

      // 形式をISO形式に変更
      const formatSelects = screen.getAllByLabelText("Format");
      fireEvent.change(formatSelects[0], { target: { value: "iso" } });

      // 日時入力フィールドを取得
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // ISO形式の日時を入力
      fireEvent.change(datetimeInput, {
        target: { value: "2024-01-01T00:00:00Z" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[0]);

      // Unix Time入力フィールドに結果が設定されることを確認
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0] as HTMLInputElement;
      expect(unixTimeInput.value).toMatch(/^\d+$/);
      expect(parseInt(unixTimeInput.value)).toBeGreaterThan(0);
    });

    // Requirement 1.4: ミリ秒単位の変換
    it("should convert datetime to Unix Time in milliseconds", () => {
      renderDateTimeConverter();

      // 単位をミリ秒に変更
      const unitSelects = screen.getAllByLabelText("Unit");
      fireEvent.change(unitSelects[0], { target: { value: "milliseconds" } });

      // 日時入力フィールドを取得
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 日時を入力
      fireEvent.change(datetimeInput, {
        target: { value: "2024/01/01 00:00:00" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[0]);

      // ミリ秒単位のUnix Timeが入力フィールドに設定されることを確認
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0] as HTMLInputElement;
      expect(unixTimeInput.value).toMatch(/^\d+$/);
      // ミリ秒なので秒の1000倍
      expect(parseInt(unixTimeInput.value)).toBeGreaterThan(1000000000000);
    });

    // エッジケース: エポックタイム
    it("should handle epoch time (1970/01/01 00:00:00)", () => {
      renderDateTimeConverter();

      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      fireEvent.change(datetimeInput, {
        target: { value: "1970/01/01 00:00:00" },
      });

      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[0]);

      // Unix Time入力フィールドに値が設定されることを確認（タイムゾーンにより異なる）
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0] as HTMLInputElement;
      expect(unixTimeInput.value).toMatch(/^-?\d+$/);
    });
  });

  describe("Unix Time to DateTime Conversion", () => {
    // Requirement 2.1: Unix Time(秒)から日時への変換
    it("should convert Unix Time (seconds) to datetime", () => {
      renderDateTimeConverter();

      // Unix Time入力フィールドを取得
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0];

      // Unix Timeを入力 (1704067200 = 2024/01/01 00:00:00 UTC)
      fireEvent.change(unixTimeInput, {
        target: { value: "1704067200" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[1]);

      // 日時が表示されることを確認
      expect(screen.getByText(/2024\/01\/01/)).toBeInTheDocument();
    });

    // Requirement 2.2: Unix Time(ミリ秒)から日時への変換
    it("should convert Unix Time (milliseconds) to datetime", () => {
      renderDateTimeConverter();

      // 単位をミリ秒に変更
      const unitSelects = screen.getAllByLabelText("Unit");
      fireEvent.change(unitSelects[1], { target: { value: "milliseconds" } });

      // Unix Time入力フィールドを取得
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0];

      // ミリ秒単位のUnix Timeを入力
      fireEvent.change(unixTimeInput, {
        target: { value: "1704067200000" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[1]);

      // 日時が表示されることを確認
      expect(screen.getByText(/2024\/01\/01/)).toBeInTheDocument();
    });

    // Requirement 2.3: タイムゾーンを考慮した変換
    it("should convert Unix Time with timezone consideration", () => {
      renderDateTimeConverter();

      // タイムゾーンをAsia/Tokyoに変更
      const timezoneSelect = screen.getByLabelText("Timezone");
      fireEvent.change(timezoneSelect, { target: { value: "Asia/Tokyo" } });

      // Unix Time入力フィールドを取得
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0];

      // Unix Timeを入力
      fireEvent.change(unixTimeInput, {
        target: { value: "1704067200" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[1]);

      // 日時が表示されることを確認 (Asia/Tokyoは+9時間)
      expect(screen.getByText(/2024\/01\/01 09:00:00/)).toBeInTheDocument();
    });

    // Requirement 2.4: ISO形式での表示
    it("should display datetime in ISO format", () => {
      renderDateTimeConverter();

      // 形式をISO形式に変更
      const formatSelects = screen.getAllByLabelText("Format");
      fireEvent.change(formatSelects[1], { target: { value: "iso" } });

      // Unix Time入力フィールドを取得
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0];

      // Unix Timeを入力
      fireEvent.change(unixTimeInput, {
        target: { value: "1704067200" },
      });

      // 変換ボタンをクリック
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[1]);

      // ISO形式の日時が表示されることを確認
      expect(screen.getByText(/2024-01-01T/)).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display error for invalid datetime format", async () => {
      renderDateTimeConverter();

      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 無効な日時を入力
      fireEvent.change(datetimeInput, {
        target: { value: "invalid-datetime" },
      });

      // エラーメッセージが表示されるまで待機
      await waitFor(() => {
        expect(
          screen.getByText(/無効な日時形式です|Invalid datetime format/),
        ).toBeInTheDocument();
      });
    });

    it("should display error for invalid Unix Time", async () => {
      renderDateTimeConverter();

      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0];

      // 無効なUnix Timeを入力
      fireEvent.change(unixTimeInput, {
        target: { value: "not-a-number" },
      });

      // エラーメッセージが表示されるまで待機
      await waitFor(() => {
        expect(
          screen.getByText(/無効なUnix Time値です|Invalid Unix Time value/),
        ).toBeInTheDocument();
      });
    });

    it("should clear error when valid input is provided", async () => {
      renderDateTimeConverter();

      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];

      // 無効な日時を入力
      fireEvent.change(datetimeInput, {
        target: { value: "invalid" },
      });

      // エラーが表示されるまで待機
      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      // 有効な日時に修正
      fireEvent.change(datetimeInput, {
        target: { value: "2024/01/01 00:00:00" },
      });

      // エラーが解除されることを確認
      await waitFor(() => {
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    it("should update output when timezone is changed", () => {
      renderDateTimeConverter();

      // Unix Timeを入力
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0];
      fireEvent.change(unixTimeInput, {
        target: { value: "1704067200" },
      });

      // 変換
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[1]);

      // 最初の結果を確認 (UTC)
      expect(screen.getByText(/2024\/01\/01 00:00:00/)).toBeInTheDocument();

      // タイムゾーンを変更
      const timezoneSelect = screen.getByLabelText("Timezone");
      fireEvent.change(timezoneSelect, { target: { value: "Asia/Tokyo" } });

      // 再度変換
      fireEvent.click(convertButtons[1]);

      // 結果が更新されることを確認 (Asia/Tokyo = +9時間)
      expect(screen.getByText(/2024\/01\/01 09:00:00/)).toBeInTheDocument();
    });

    it("should update output when unit is changed", () => {
      renderDateTimeConverter();

      // 日時を入力
      const datetimeInputs = screen.getAllByLabelText("DateTime");
      const datetimeInput = datetimeInputs[0];
      fireEvent.change(datetimeInput, {
        target: { value: "2024/01/01 00:00:00" },
      });

      // 秒単位で変換
      const convertButtons = screen.getAllByText("Convert");
      fireEvent.click(convertButtons[0]);

      // Unix Time入力フィールドに結果が設定されることを確認
      const unixTimeInputs = screen.getAllByLabelText("Unix Time");
      const unixTimeInput = unixTimeInputs[0] as HTMLInputElement;
      const secondsValue = parseInt(unixTimeInput.value);
      expect(secondsValue).toBeGreaterThan(0);

      // 単位をミリ秒に変更
      const unitSelects = screen.getAllByLabelText("Unit");
      fireEvent.change(unitSelects[0], { target: { value: "milliseconds" } });

      // 再度変換
      fireEvent.click(convertButtons[0]);
      const millisecondsValue = parseInt(unixTimeInput.value);

      // ミリ秒は秒の1000倍
      expect(millisecondsValue).toBe(secondsValue * 1000);
    });
  });
});
