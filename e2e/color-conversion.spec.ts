import { test, expect } from "@playwright/test";

/**
 * E2E Test: Color Conversion and CSS Copy User Flow
 * Validates Requirements: 3.1, 5.1
 */

test.describe("Color Conversion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/color");
    // ページが完全にロードされるまで待機
    await page.waitForLoadState("networkidle");
  });

  test("should convert RGB to HEX", async ({ page }) => {
    // Requirement 3.1: ユーザーがRGB数値(0-255)を入力すると、
    // Color_ConverterはHEX形式に変換する

    // RGBフォーマットを選択（デフォルトで選択されているはず）
    await page.click('button:has-text("RGB")');

    // RGB値を入力 (赤色)
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("255"); // R
    await inputs.nth(1).fill("0"); // G
    await inputs.nth(2).fill("0"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // HEXフォーマットに切り替えて結果を確認
    await page.click('button:has-text("HEX")');
    const hexInput = page.locator('input[type="text"]').first();
    await expect(hexInput).toHaveValue(/#FF0000/i);
  });

  test("should display color preview in real-time", async ({ page }) => {
    // Requirement 3.5: 入力された色をリアルタイムでプレビュー表示する

    // RGBフォーマットを選択
    await page.click('button:has-text("RGB")');

    // RGB値を入力 (青色)
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("0"); // R
    await inputs.nth(1).fill("0"); // G
    await inputs.nth(2).fill("255"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // プレビューの背景色を確認
    const preview = page.locator('[data-testid="color-preview"]');
    await expect(preview).toHaveCSS("background-color", "rgb(0, 0, 255)");
  });

  test("should copy CSS to clipboard", async ({ page }) => {
    // Requirement 5.1: ユーザーがコピーボタンをクリックすると、
    // Color_Converterは現在の色をCSS形式でクリップボードにコピーする

    // RGBフォーマットを選択
    await page.click('button:has-text("RGB")');

    // RGB値を入力 (緑色)
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("0"); // R
    await inputs.nth(1).fill("255"); // G
    await inputs.nth(2).fill("0"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // RGBコピーボタンをクリック
    await page.locator('button:has-text("RGB")').last().click();

    // 成功メッセージを確認
    // Requirement 5.6: コピーが成功するとユーザーに成功メッセージを表示する
    const successMessage = page.locator('[role="alert"]').last();
    await expect(successMessage).toBeVisible();
  });

  test("should convert HEX to RGB", async ({ page }) => {
    // Requirement 3.2: ユーザーがHEX形式を入力すると、RGB数値に変換する

    // HEXフォーマットを選択
    await page.click('button:has-text("HEX")');

    // HEX値を入力
    const hexInput = page.locator('input[type="text"]').first();
    await hexInput.fill("#FF00FF");

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // RGBフォーマットに切り替えて結果を確認 (マゼンタ)
    await page.click('button:has-text("RGB")');
    const inputs = page.locator('input[type="text"]');
    await expect(inputs.nth(0)).toHaveValue("255"); // R
    await expect(inputs.nth(1)).toHaveValue("0"); // G
    await expect(inputs.nth(2)).toHaveValue("255"); // B
  });

  test("should handle ARGB with alpha channel", async ({ page }) => {
    // Requirement 3.3, 3.4: ARGB値とHEX(#AARRGGBB)の相互変換

    // ARGBフォーマットを選択
    await page.click('button:has-text("ARGB")');

    // ARGB値を入力 (半透明の赤)
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("128"); // A
    await inputs.nth(1).fill("255"); // R
    await inputs.nth(2).fill("0"); // G
    await inputs.nth(3).fill("0"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // HEXフォーマットに切り替えて結果を確認
    await page.click('button:has-text("HEX")');
    const hexInput = page.locator('input[type="text"]').first();
    // ARGB HEXは #RRGGBB 形式で表示される（アルファは別管理）
    await expect(hexInput).toHaveValue(/#FF0000/i);
  });

  test("should convert between RGB and HSL", async ({ page }) => {
    // Requirement 4.3, 4.4: RGB-HSL相互変換

    // RGBフォーマットを選択
    await page.click('button:has-text("RGB")');

    // RGB値を入力 (赤色)
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("255"); // R
    await inputs.nth(1).fill("0"); // G
    await inputs.nth(2).fill("0"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // HSLフォーマットに切り替えて結果を確認
    await page.click('button:has-text("HSL")');
    const hslInputs = page.locator('input[type="text"]');
    await expect(hslInputs.nth(0)).toHaveValue("0"); // H
    await expect(hslInputs.nth(1)).toHaveValue("100"); // S
    await expect(hslInputs.nth(2)).toHaveValue("50"); // L
  });

  test("should convert between RGB and CMYK", async ({ page }) => {
    // Requirement 4.1, 4.2: RGB-CMYK相互変換

    // RGBフォーマットを選択
    await page.click('button:has-text("RGB")');

    // RGB値を入力 (シアン)
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("0"); // R
    await inputs.nth(1).fill("255"); // G
    await inputs.nth(2).fill("255"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // CMYKフォーマットに切り替えて結果を確認
    await page.click('button:has-text("CMYK")');
    const cmykInputs = page.locator('input[type="text"]');
    await expect(cmykInputs.nth(0)).toHaveValue("100"); // C
    await expect(cmykInputs.nth(1)).toHaveValue("0"); // M
    await expect(cmykInputs.nth(2)).toHaveValue("0"); // Y
    await expect(cmykInputs.nth(3)).toHaveValue("0"); // K
  });

  test("should display error for invalid color values", async ({ page }) => {
    // Requirement 3.6: 無効なカラーコードが入力されるとエラーメッセージを表示する

    // RGBフォーマットを選択
    await page.click('button:has-text("RGB")');

    // 無効なRGB値を入力 (範囲外)
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("300"); // R (範囲外)
    await inputs.nth(1).fill("0"); // G
    await inputs.nth(2).fill("0"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // エラーメッセージを確認
    const error = page.locator('[role="alert"]').last();
    await expect(error).toBeVisible();
  });

  test("should copy different CSS formats", async ({ page }) => {
    // Requirement 5.2, 5.3, 5.4, 5.5: 複数のCSS形式をコピー可能

    // RGBフォーマットを選択
    await page.click('button:has-text("RGB")');

    // RGB値を入力
    const inputs = page.locator('input[type="text"]');
    await inputs.nth(0).fill("100"); // R
    await inputs.nth(1).fill("150"); // G
    await inputs.nth(2).fill("200"); // B

    // 変換ボタンをクリック
    await page.click('button:has-text("Convert")');

    // RGB形式でコピー
    await page.locator('button:has-text("RGB")').last().click();
    const successMessage = page.locator('[role="alert"]').last();
    await expect(successMessage).toBeVisible();

    // 少し待機
    await page.waitForTimeout(500);

    // HEX形式でコピー
    await page.locator('button:has-text("HEX")').last().click();
    await expect(successMessage).toBeVisible();

    // 少し待機
    await page.waitForTimeout(500);

    // HSL形式でコピー
    await page.locator('button:has-text("HSL")').last().click();
    await expect(successMessage).toBeVisible();
  });
});
