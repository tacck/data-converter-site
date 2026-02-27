import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { InputField } from "./InputField";

describe("InputField", () => {
  it("ラベルと入力フィールドが正しく表示される", () => {
    const onChange = vi.fn();
    render(<InputField label="テストラベル" value="" onChange={onChange} />);

    // ラベルが表示されている
    expect(screen.getByText("テストラベル")).toBeInTheDocument();

    // 入力フィールドが表示されている
    const input = screen.getByLabelText("テストラベル");
    expect(input).toBeInTheDocument();
  });

  it("入力値が変更されるとonChangeが呼ばれる", () => {
    const onChange = vi.fn();
    render(<InputField label="テストラベル" value="" onChange={onChange} />);

    const input = screen.getByLabelText("テストラベル");
    fireEvent.change(input, { target: { value: "新しい値" } });

    expect(onChange).toHaveBeenCalledWith("新しい値");
  });

  it("エラーメッセージが表示される", () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="テストラベル"
        value=""
        error="エラーメッセージ"
        onChange={onChange}
      />,
    );

    // エラーメッセージが表示されている
    const errorMessage = screen.getByText("エラーメッセージ");
    expect(errorMessage).toBeInTheDocument();

    // role="alert"が設定されている (要件8.5)
    expect(errorMessage).toHaveAttribute("role", "alert");

    // aria-live="polite"が設定されている (要件8.5)
    expect(errorMessage).toHaveAttribute("aria-live", "polite");
  });

  it("エラー状態の入力フィールドにaria-invalid属性が設定される", () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="テストラベル"
        value=""
        error="エラーメッセージ"
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("テストラベル");

    // aria-invalid="true"が設定されている
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("エラー状態の入力フィールドがaria-describedbyでエラーメッセージと関連付けられる", () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="テストラベル"
        value=""
        error="エラーメッセージ"
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("テストラベル");
    const errorMessage = screen.getByText("エラーメッセージ");

    // aria-describedbyが設定されている
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    // エラーメッセージのIDと一致する
    expect(errorMessage).toHaveAttribute("id", describedBy);
  });

  it("エラーがない場合、aria-invalidはfalseになる", () => {
    const onChange = vi.fn();
    render(<InputField label="テストラベル" value="" onChange={onChange} />);

    const input = screen.getByLabelText("テストラベル");

    // aria-invalid="false"が設定されている
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("プレースホルダーが表示される", () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="テストラベル"
        value=""
        placeholder="プレースホルダー"
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("テストラベル");
    expect(input).toHaveAttribute("placeholder", "プレースホルダー");
  });

  it("disabled状態が正しく反映される", () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="テストラベル"
        value=""
        disabled={true}
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("テストラベル");
    expect(input).toBeDisabled();
  });

  it("type属性が正しく設定される", () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="テストラベル"
        value=""
        type="number"
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("テストラベル");
    expect(input).toHaveAttribute("type", "number");
  });

  it("カスタムIDが指定された場合、そのIDが使用される", () => {
    const onChange = vi.fn();
    render(
      <InputField
        label="テストラベル"
        value=""
        id="custom-id"
        onChange={onChange}
      />,
    );

    const input = screen.getByLabelText("テストラベル");
    expect(input).toHaveAttribute("id", "custom-id");
  });
});
