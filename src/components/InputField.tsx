import React from "react";

export interface InputFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  id?: string;
  type?: "text" | "number";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 入力フィールドコンポーネント
 *
 * アクセシビリティ要件:
 * - 要件8.1: すべての入力フィールドに適切なラベルを提供
 * - 要件8.5: エラーメッセージをスクリーンリーダーで読み上げ可能に
 * - 要件9.2: エラーメッセージを入力フィールドの近くに表示
 * - 要件9.3: エラー状態の入力フィールドを視覚的に強調
 */
export function InputField({
  label,
  value,
  error,
  onChange,
  id,
  type = "text",
  placeholder,
  disabled = false,
  className = "",
}: InputFieldProps) {
  // IDが指定されていない場合、ラベルから生成
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const errorId = `${inputId}-error`;
  const hasError = !!error;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* ラベル - 要件8.1 */}
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>

      {/* 入力フィールド */}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        // アクセシビリティ属性
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className={`
          rounded border px-3 py-2 text-sm
          focus:outline-none focus:ring-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${
            hasError
              ? // 要件9.3: エラー状態の視覚的強調
                "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:bg-red-950 dark:text-red-100"
              : // 通常状態
                "border-zinc-300 bg-white text-zinc-900 focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          }
        `}
      />

      {/* エラーメッセージ - 要件8.5, 9.2 */}
      {hasError && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </div>
      )}
    </div>
  );
}
