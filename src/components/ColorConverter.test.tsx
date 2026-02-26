/**
 * ColorConverterコンポーネントのユニットテスト
 *
 * 具体的な色の変換例、ユーザーインタラクション、CSSコピー機能をテスト
 */

import React from "react";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ColorConverter } from "./ColorConverter";

// next-intlのモック
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// クリップボードAPIのモック
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe("ColorConverter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("初期レンダリング", () => {
    it("コンポーネントが正常にレンダリングされる", () => {
      const { container } = render(<ColorConverter />);
      expect(container).toBeTruthy();
    });

    it("初期状態で赤色(#FF0000)がプレビューに表示される", () => {
      const { container } = render(<ColorConverter />);
      const preview = container.querySelector(
        '[data-testid="color-preview"]',
      ) as HTMLElement;

      expect(preview).toBeTruthy();
      expect(preview.style.backgroundColor).toBe("#FF0000");
    });

    it("すべてのフォーマットボタンが表示される", () => {
      render(<ColorConverter />);

      // フォーマットボタンのテキストを確認
      expect(screen.getByText("rgb")).toBeTruthy();
      expect(screen.getByText("argb")).toBeTruthy();
      expect(screen.getByText("hex")).toBeTruthy();
      expect(screen.getByText("cmyk")).toBeTruthy();
      expect(screen.getByText("hsl")).toBeTruthy();
    });
  });

  describe("フォーマット切り替え", () => {
    it("RGBフォーマットが初期選択されている", () => {
      const { container } = render(<ColorConverter />);

      // RGB入力フィールドが表示されている
      const redInput = screen.getByLabelText("red");
      const greenInput = screen.getByLabelText("green");
      const blueInput = screen.getByLabelText("blue");

      expect(redInput).toBeTruthy();
      expect(greenInput).toBeTruthy();
      expect(blueInput).toBeTruthy();
    });

    it("HEXフォーマットに切り替えられる", () => {
      render(<ColorConverter />);

      // HEXボタンをクリック
      const hexButton = screen.getByText("hex");
      fireEvent.click(hexButton);

      // HEX入力フィールドが表示される
      const hexInput = screen.getByLabelText("hex");
      expect(hexInput).toBeTruthy();
    });

    it("CMYKフォーマットに切り替えられる", () => {
      render(<ColorConverter />);

      // CMYKボタンをクリック
      const cmykButton = screen.getByText("cmyk");
      fireEvent.click(cmykButton);

      // CMYK入力フィールドが表示される
      const cyanInput = screen.getByLabelText("cyan");
      const magentaInput = screen.getByLabelText("magenta");
      const yellowInput = screen.getByLabelText("yellow");
      const keyInput = screen.getByLabelText("key");

      expect(cyanInput).toBeTruthy();
      expect(magentaInput).toBeTruthy();
      expect(yellowInput).toBeTruthy();
      expect(keyInput).toBeTruthy();
    });

    it("HSLフォーマットに切り替えられる", () => {
      render(<ColorConverter />);

      // HSLボタンをクリック
      const hslButton = screen.getByText("hsl");
      fireEvent.click(hslButton);

      // HSL入力フィールドが表示される
      const hueInput = screen.getByLabelText("hue");
      const saturationInput = screen.getByLabelText("saturation");
      const lightnessInput = screen.getByLabelText("lightness");

      expect(hueInput).toBeTruthy();
      expect(saturationInput).toBeTruthy();
      expect(lightnessInput).toBeTruthy();
    });
  });

  describe("RGB変換", () => {
    it("青色(0, 0, 255)を正しく変換する", async () => {
      const { container } = render(<ColorConverter />);

      // RGB値を入力
      const redInput = screen.getByLabelText("red") as HTMLInputElement;
      const greenInput = screen.getByLabelText("green") as HTMLInputElement;
      const blueInput = screen.getByLabelText("blue") as HTMLInputElement;

      fireEvent.change(redInput, { target: { value: "0" } });
      fireEvent.change(greenInput, { target: { value: "0" } });
      fireEvent.change(blueInput, { target: { value: "255" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const preview = container.querySelector(
          '[data-testid="color-preview"]',
        ) as HTMLElement;
        expect(preview.style.backgroundColor).toBe("#0000FF");
      });
    });

    it("緑色(0, 255, 0)を正しく変換する", async () => {
      const { container } = render(<ColorConverter />);

      // RGB値を入力
      const redInput = screen.getByLabelText("red") as HTMLInputElement;
      const greenInput = screen.getByLabelText("green") as HTMLInputElement;
      const blueInput = screen.getByLabelText("blue") as HTMLInputElement;

      fireEvent.change(redInput, { target: { value: "0" } });
      fireEvent.change(greenInput, { target: { value: "255" } });
      fireEvent.change(blueInput, { target: { value: "0" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const preview = container.querySelector(
          '[data-testid="color-preview"]',
        ) as HTMLElement;
        expect(preview.style.backgroundColor).toBe("#00FF00");
      });
    });

    it("黒色(0, 0, 0)を正しく変換する", async () => {
      const { container } = render(<ColorConverter />);

      // RGB値を入力
      const redInput = screen.getByLabelText("red") as HTMLInputElement;
      const greenInput = screen.getByLabelText("green") as HTMLInputElement;
      const blueInput = screen.getByLabelText("blue") as HTMLInputElement;

      fireEvent.change(redInput, { target: { value: "0" } });
      fireEvent.change(greenInput, { target: { value: "0" } });
      fireEvent.change(blueInput, { target: { value: "0" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const preview = container.querySelector(
          '[data-testid="color-preview"]',
        ) as HTMLElement;
        expect(preview.style.backgroundColor).toBe("#000000");
      });
    });

    it("白色(255, 255, 255)を正しく変換する", async () => {
      const { container } = render(<ColorConverter />);

      // RGB値を入力
      const redInput = screen.getByLabelText("red") as HTMLInputElement;
      const greenInput = screen.getByLabelText("green") as HTMLInputElement;
      const blueInput = screen.getByLabelText("blue") as HTMLInputElement;

      fireEvent.change(redInput, { target: { value: "255" } });
      fireEvent.change(greenInput, { target: { value: "255" } });
      fireEvent.change(blueInput, { target: { value: "255" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const preview = container.querySelector(
          '[data-testid="color-preview"]',
        ) as HTMLElement;
        expect(preview.style.backgroundColor).toBe("#FFFFFF");
      });
    });
  });

  describe("HEX変換", () => {
    it("HEX形式(#00FF00)を正しく変換する", async () => {
      const { container } = render(<ColorConverter />);

      // HEXフォーマットに切り替え
      const hexButton = screen.getByText("hex");
      fireEvent.click(hexButton);

      // HEX値を入力
      const hexInput = screen.getByLabelText("hex") as HTMLInputElement;
      fireEvent.change(hexInput, { target: { value: "#00FF00" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const preview = container.querySelector(
          '[data-testid="color-preview"]',
        ) as HTMLElement;
        expect(preview.style.backgroundColor).toBe("#00FF00");
      });
    });
  });

  describe("エラーハンドリング", () => {
    it("無効なRGB値(256)でエラーを表示する", async () => {
      render(<ColorConverter />);

      // 無効なRGB値を入力
      const redInput = screen.getByLabelText("red") as HTMLInputElement;
      fireEvent.change(redInput, { target: { value: "256" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const errorElement = screen.getByRole("alert");
        expect(errorElement).toBeTruthy();
      });
    });

    it("無効なRGB値(-1)でエラーを表示する", async () => {
      render(<ColorConverter />);

      // 無効なRGB値を入力
      const redInput = screen.getByLabelText("red") as HTMLInputElement;
      fireEvent.change(redInput, { target: { value: "-1" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const errorElement = screen.getByRole("alert");
        expect(errorElement).toBeTruthy();
      });
    });

    it("無効なHEX形式でエラーを表示する", async () => {
      render(<ColorConverter />);

      // HEXフォーマットに切り替え
      const hexButton = screen.getByText("hex");
      fireEvent.click(hexButton);

      // 無効なHEX値を入力
      const hexInput = screen.getByLabelText("hex") as HTMLInputElement;
      fireEvent.change(hexInput, { target: { value: "invalid" } });

      // 変換ボタンをクリック
      const convertButton = screen.getByText("convert");
      fireEvent.click(convertButton);

      await waitFor(() => {
        const errorElement = screen.getByRole("alert");
        expect(errorElement).toBeTruthy();
      });
    });
  });

  describe("CSSコピー機能", () => {
    it("RGBフォーマットでCSSをコピーできる", async () => {
      render(<ColorConverter />);

      // RGBコピーボタンをクリック
      const rgbCopyButton = screen.getByText("RGB");
      fireEvent.click(rgbCopyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          "rgb(255, 0, 0)",
        );
      });
    });

    it("HEXフォーマットでCSSをコピーできる", async () => {
      render(<ColorConverter />);

      // HEXコピーボタンをクリック
      const hexCopyButton = screen.getByText("HEX");
      fireEvent.click(hexCopyButton);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("#FF0000");
      });
    });

    it("コピー成功メッセージが表示される", async () => {
      render(<ColorConverter />);

      // RGBコピーボタンをクリック
      const rgbCopyButton = screen.getByText("RGB");
      fireEvent.click(rgbCopyButton);

      await waitFor(() => {
        const successMessage = screen.getByText("copied");
        expect(successMessage).toBeTruthy();
      });
    });
  });
});
