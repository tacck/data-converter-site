import React from "react";

export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  ariaLabel?: string;
}

/**
 * ボタンコンポーネント
 *
 * アクセシビリティ要件:
 * - 要件8.2: キーボードのみですべての機能を操作可能にする
 * - 要件8.6: フォーカス状態を視覚的に明確にする
 */
export function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  ariaLabel,
}: ButtonProps) {
  // キーボードイベントハンドラ - 要件8.2
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // EnterキーとSpaceキーでボタンを実行
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onClick();
      }
    }
  };

  // バリアント別のスタイル
  const variantStyles = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700
      active:bg-blue-800
      disabled:bg-blue-300 disabled:cursor-not-allowed
      dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700
      dark:disabled:bg-blue-900
    `,
    secondary: `
      bg-zinc-200 text-zinc-900
      hover:bg-zinc-300
      active:bg-zinc-400
      disabled:bg-zinc-100 disabled:cursor-not-allowed disabled:text-zinc-400
      dark:bg-zinc-700 dark:text-zinc-50
      dark:hover:bg-zinc-600 dark:active:bg-zinc-500
      dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel || label}
      className={`
        rounded px-4 py-2 text-sm font-medium
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-zinc-900
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {label}
    </button>
  );
}
