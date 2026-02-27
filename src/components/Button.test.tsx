import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  describe("基本機能", () => {
    it("ラベルを表示する", () => {
      render(<Button label="クリック" onClick={() => {}} />);
      expect(
        screen.getByRole("button", { name: "クリック" }),
      ).toBeInTheDocument();
    });

    it("クリック時にonClickハンドラを呼び出す", () => {
      const handleClick = vi.fn();
      render(<Button label="クリック" onClick={handleClick} />);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("type属性を設定できる", () => {
      render(<Button label="送信" onClick={() => {}} type="submit" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("デフォルトのtype属性はbuttonである", () => {
      render(<Button label="ボタン" onClick={() => {}} />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("バリアント", () => {
    it("primaryバリアントのスタイルを適用する", () => {
      render(<Button label="Primary" onClick={() => {}} variant="primary" />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-blue-600");
    });

    it("secondaryバリアントのスタイルを適用する", () => {
      render(
        <Button label="Secondary" onClick={() => {}} variant="secondary" />,
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-zinc-200");
    });

    it("デフォルトはprimaryバリアントである", () => {
      render(<Button label="Default" onClick={() => {}} />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("bg-blue-600");
    });
  });

  describe("無効化状態", () => {
    it("disabled属性を設定できる", () => {
      render(<Button label="無効" onClick={() => {}} disabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("無効化時はonClickハンドラを呼び出さない", () => {
      const handleClick = vi.fn();
      render(<Button label="無効" onClick={handleClick} disabled />);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("アクセシビリティ - 要件8.2: キーボード操作", () => {
    it("Enterキーでボタンを実行する", () => {
      const handleClick = vi.fn();
      render(<Button label="Enter" onClick={handleClick} />);

      fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("Spaceキーでボタンを実行する", () => {
      const handleClick = vi.fn();
      render(<Button label="Space" onClick={handleClick} />);

      fireEvent.keyDown(screen.getByRole("button"), { key: " " });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("無効化時はキーボード操作でonClickハンドラを呼び出さない", () => {
      const handleClick = vi.fn();
      render(<Button label="無効" onClick={handleClick} disabled />);

      fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
      fireEvent.keyDown(screen.getByRole("button"), { key: " " });
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("その他のキーでは実行しない", () => {
      const handleClick = vi.fn();
      render(<Button label="Other" onClick={handleClick} />);

      fireEvent.keyDown(screen.getByRole("button"), { key: "a" });
      fireEvent.keyDown(screen.getByRole("button"), { key: "Escape" });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("アクセシビリティ - 要件8.6: フォーカス状態", () => {
    it("フォーカスリングのスタイルを持つ", () => {
      render(<Button label="Focus" onClick={() => {}} />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("focus:ring-2");
      expect(button.className).toContain("focus:ring-blue-500");
    });
  });

  describe("ARIA属性", () => {
    it("aria-label属性を設定できる", () => {
      render(
        <Button label="ボタン" onClick={() => {}} ariaLabel="カスタムラベル" />,
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "カスタムラベル",
      );
    });

    it("aria-labelが指定されていない場合はlabelを使用する", () => {
      render(<Button label="デフォルトラベル" onClick={() => {}} />);
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "デフォルトラベル",
      );
    });
  });

  describe("カスタムクラス", () => {
    it("追加のclassNameを適用できる", () => {
      render(
        <Button label="Custom" onClick={() => {}} className="custom-class" />,
      );
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });
  });
});
