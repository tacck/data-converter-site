"use client";

import React, { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { InputField } from "./InputField";
import { Button } from "./Button";
import {
  parseDateTime,
  toUnixTime,
  fromUnixTime,
  formatDateTime,
} from "@/lib/datetime-utils";
import {
  validateDateTimeInput,
  validateUnixTimeInput,
} from "@/lib/validation-utils";

/**
 * 日時変換コンポーネントの状態
 */
interface DateTimeState {
  // 入力値
  datetimeInput: string;
  unixTimeInput: string;

  // 設定
  timezone: string;
  unit: "seconds" | "milliseconds";
  format: "standard" | "iso";

  // エラー
  datetimeError: string | null;
  unixTimeError: string | null;
}

/**
 * DateTimeConverterコンポーネント
 *
 * 日時とUnix Timeの相互変換を提供します。
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4
 */
export function DateTimeConverter() {
  const t = useTranslations("datetime");
  const tErrors = useTranslations("errors");

  // 状態管理
  const [state, setState] = useState<DateTimeState>({
    datetimeInput: "",
    unixTimeInput: "",
    timezone: "UTC",
    unit: "seconds",
    format: "standard",
    datetimeError: null,
    unixTimeError: null,
  });

  /**
   * 日時からUnix Timeへの変換
   * Requirements: 1.1, 1.2, 1.3, 1.4
   */
  const convertToUnixTime = useCallback(() => {
    // バリデーション
    const validation = validateDateTimeInput(state.datetimeInput, state.format);

    if (!validation.isValid) {
      setState((prev) => ({
        ...prev,
        datetimeError: validation.errorMessage,
        unixTimeInput: "",
      }));
      return;
    }

    try {
      // 日時をパース
      const date = parseDateTime(state.datetimeInput, state.format);

      if (!date) {
        setState((prev) => ({
          ...prev,
          datetimeError: tErrors("invalidDateTime"),
          unixTimeInput: "",
        }));
        return;
      }

      // Unix Timeに変換
      const unixTime = toUnixTime(date, state.unit);

      setState((prev) => ({
        ...prev,
        unixTimeInput: unixTime.toString(),
        datetimeError: null,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : tErrors("conversionError");
      setState((prev) => ({
        ...prev,
        datetimeError: errorMessage,
        unixTimeInput: "",
      }));
    }
  }, [state.datetimeInput, state.format, state.unit, tErrors]);

  /**
   * Unix Timeから日時への変換
   * Requirements: 2.1, 2.2, 2.3, 2.4
   */
  const convertFromUnixTime = useCallback(() => {
    // バリデーション
    const validation = validateUnixTimeInput(state.unixTimeInput, state.unit);

    if (!validation.isValid) {
      setState((prev) => ({
        ...prev,
        unixTimeError: validation.errorMessage,
        datetimeInput: "",
      }));
      return;
    }

    try {
      // Unix Timeをパース
      const timestamp = Number(state.unixTimeInput);

      // 日時に変換
      const date = fromUnixTime(timestamp, state.unit);

      // フォーマット
      const formatted = formatDateTime(date, state.format, state.timezone);

      setState((prev) => ({
        ...prev,
        datetimeInput: formatted,
        unixTimeError: null,
      }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : tErrors("conversionError");
      setState((prev) => ({
        ...prev,
        unixTimeError: errorMessage,
        datetimeInput: "",
      }));
    }
  }, [state.unixTimeInput, state.unit, state.format, state.timezone, tErrors]);

  /**
   * 日時入力の変更ハンドラ
   * Requirements: 9.4 - リアルタイムエラー更新
   */
  const handleDateTimeChange = useCallback(
    (value: string) => {
      // リアルタイムバリデーション
      let errorMessage: string | null = null;

      if (value.trim() !== "") {
        const validation = validateDateTimeInput(value, state.format);
        if (!validation.isValid) {
          errorMessage = validation.errorMessage;
        }
      }

      setState((prev) => ({
        ...prev,
        datetimeInput: value,
        datetimeError: errorMessage,
      }));
    },
    [state.format],
  );

  /**
   * Unix Time入力の変更ハンドラ
   * Requirements: 9.4 - リアルタイムエラー更新
   */
  const handleUnixTimeChange = useCallback(
    (value: string) => {
      // リアルタイムバリデーション
      let errorMessage: string | null = null;

      if (value.trim() !== "") {
        const validation = validateUnixTimeInput(value, state.unit);
        if (!validation.isValid) {
          errorMessage = validation.errorMessage;
        }
      }

      setState((prev) => ({
        ...prev,
        unixTimeInput: value,
        unixTimeError: errorMessage,
      }));
    },
    [state.unit],
  );

  /**
   * タイムゾーン変更ハンドラ
   */
  const handleTimezoneChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setState((prev) => ({
        ...prev,
        timezone: e.target.value,
      }));
    },
    [],
  );

  /**
   * 単位変更ハンドラ
   */
  const handleUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setState((prev) => ({
        ...prev,
        unit: e.target.value as "seconds" | "milliseconds",
      }));
    },
    [],
  );

  /**
   * 形式変更ハンドラ
   */
  const handleFormatChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setState((prev) => ({
        ...prev,
        format: e.target.value as "standard" | "iso",
      }));
    },
    [],
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 日時からUnix Timeへの変換 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("toUnixTime")}
        </h3>
        <p className="mb-4 sm:mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          {t("description.toUnixTime")}
        </p>

        <div className="space-y-4">
          {/* 日時入力 */}
          <InputField
            label={t("datetimeInput")}
            value={state.datetimeInput}
            onChange={handleDateTimeChange}
            error={state.datetimeError || undefined}
            placeholder={t("placeholder.datetime")}
          />

          {/* 形式選択と単位選択 - レスポンシブグリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 形式選択 */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="format-select"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {t("format")}
              </label>
              <select
                id="format-select"
                value={state.format}
                onChange={handleFormatChange}
                className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-offset-zinc-900"
                aria-label={t("format")}
              >
                <option value="standard">{t("standard")}</option>
                <option value="iso">{t("iso")}</option>
              </select>
            </div>

            {/* 単位選択 */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="unit-select"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {t("unit")}
              </label>
              <select
                id="unit-select"
                value={state.unit}
                onChange={handleUnitChange}
                className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-offset-zinc-900"
                aria-label={t("unit")}
              >
                <option value="seconds">{t("seconds")}</option>
                <option value="milliseconds">{t("milliseconds")}</option>
              </select>
            </div>
          </div>

          {/* 変換ボタン */}
          <Button
            label={t("convert")}
            onClick={convertToUnixTime}
            variant="primary"
            className="w-full sm:w-auto"
          />

          {/* Unix Time出力 */}
          {state.unixTimeInput && !state.datetimeError && (
            <div className="rounded bg-zinc-100 p-4 dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t("outputLabel")}:
              </p>
              <p className="mt-1 font-mono text-base sm:text-lg break-all text-zinc-900 dark:text-zinc-50">
                {state.unixTimeInput}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Unix Timeから日時への変換 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("fromUnixTime")}
        </h3>
        <p className="mb-4 sm:mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          {t("description.fromUnixTime")}
        </p>

        <div className="space-y-4">
          {/* Unix Time入力 */}
          <InputField
            label={t("unixTimeInput")}
            value={state.unixTimeInput}
            onChange={handleUnixTimeChange}
            error={state.unixTimeError || undefined}
            placeholder={t("placeholder.unixTime")}
            type="text"
          />

          {/* 単位選択とタイムゾーン選択 - レスポンシブグリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 単位選択 */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="unit-select-2"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {t("unit")}
              </label>
              <select
                id="unit-select-2"
                value={state.unit}
                onChange={handleUnitChange}
                className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-offset-zinc-900"
                aria-label={t("unit")}
              >
                <option value="seconds">{t("seconds")}</option>
                <option value="milliseconds">{t("milliseconds")}</option>
              </select>
            </div>

            {/* タイムゾーン選択 */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="timezone-select"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                {t("timezone")}
              </label>
              <select
                id="timezone-select"
                value={state.timezone}
                onChange={handleTimezoneChange}
                className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-offset-zinc-900"
                aria-label={t("timezone")}
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
              </select>
            </div>
          </div>

          {/* 形式選択 */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="format-select-2"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              {t("format")}
            </label>
            <select
              id="format-select-2"
              value={state.format}
              onChange={handleFormatChange}
              className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:ring-offset-zinc-900"
              aria-label={t("format")}
            >
              <option value="standard">{t("standard")}</option>
              <option value="iso">{t("iso")}</option>
            </select>
          </div>

          {/* 変換ボタン */}
          <Button
            label={t("convert")}
            onClick={convertFromUnixTime}
            variant="primary"
            className="w-full sm:w-auto"
          />

          {/* 日時出力 */}
          {state.datetimeInput && !state.unixTimeError && (
            <div className="rounded bg-zinc-100 p-4 dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t("outputLabel")}:
              </p>
              <p className="mt-1 font-mono text-base sm:text-lg break-all text-zinc-900 dark:text-zinc-50">
                {state.datetimeInput}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
