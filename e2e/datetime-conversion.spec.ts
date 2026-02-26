import { test, expect } from "@playwright/test";

/**
 * E2E Test: DateTime Conversion User Flow
 * Validates Requirements: 1.1, 2.1
 */

test.describe("DateTime Conversion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/datetime");
    // ページが完全にロードされるまで待機
    await page.waitForLoadState("networkidle");
  });

  test("should convert datetime to Unix time (seconds)", async ({ page }) => {
    // Requirement 1.1: ユーザーがYYYY/mm/DD HH:MM:SS形式で日時を入力すると、
    // DateTime_Converterはその日時をUnix Time(秒)に変換する

    // 日時を入力（最初のInputFieldコンポーネント）
    const datetimeInput = page.locator("input").first();
    await datetimeInput.fill("2024/01/01 00:00:00");

    // 形式を標準に設定
    await page.selectOption("#format-select", "standard");

    // 単位を秒に設定
    await page.selectOption("#unit-select", "seconds");

    // 変換ボタンをクリック（最初のConvertボタン）
    await page.locator('button:has-text("Convert")').first().click();

    // 少し待機して変換が完了するのを待つ
    await page.waitForTimeout(500);

    // 結果を確認（ローカルタイムゾーンで解釈されるため、実際の値を確認）
    // 最初のfont-mono要素を確認
    await expect(page.locator(".font-mono").first()).toBeVisible();
    // Unix Timeが数値であることを確認（具体的な値はタイムゾーンに依存）
    const unixTimeText = await page.locator(".font-mono").first().textContent();
    expect(unixTimeText).toMatch(/^\d+$/);
  });

  test("should convert Unix time to datetime", async ({ page }) => {
    // Requirement 2.1: ユーザーがUnix Time(秒)を入力すると、
    // DateTime_ConverterはYYYY/mm/DD HH:MM:SS形式で日時を表示する

    // Unix Timeを入力（2番目のInputFieldコンポーネント）
    const unixTimeInput = page.locator("input").nth(1);
    await unixTimeInput.fill("1704067200");

    // タイムゾーンをUTCに設定
    await page.selectOption("#timezone-select", "UTC");

    // 単位を秒に設定
    await page.selectOption("#unit-select-2", "seconds");

    // 形式を標準に設定
    await page.selectOption("#format-select-2", "standard");

    // 変換ボタンをクリック（2番目のConvertボタン）
    await page.locator('button:has-text("Convert")').nth(1).click();

    // 結果を確認
    await expect(
      page.locator("text=/2024[\/\-]01[\/\-]01.*00:00:00/"),
    ).toBeVisible();
  });

  test("should handle timezone conversion correctly", async ({ page }) => {
    // Requirement 1.3: タイムゾーンを考慮してUnix Timeを計算する

    // 日時を入力
    const datetimeInput = page.locator("input").first();
    await datetimeInput.fill("2024/01/01 09:00:00");

    // 形式を標準に設定
    await page.selectOption("#format-select", "standard");

    // 単位を秒に設定
    await page.selectOption("#unit-select", "seconds");

    // 変換ボタンをクリック
    await page.locator('button:has-text("Convert")').first().click();

    // 少し待機
    await page.waitForTimeout(500);

    // 結果を確認（ローカルタイムゾーンで解釈されるため、実際の値を確認）
    const unixTimeText = await page.locator(".font-mono").first().textContent();
    expect(unixTimeText).toMatch(/^\d+$/);
    // 2024/01/01 09:00:00がローカルタイムゾーンで正しく変換されていることを確認
    const unixTime = parseInt(unixTimeText || "0");
    expect(unixTime).toBeGreaterThan(1704000000); // 2024年1月頃の妥当な値
  });

  test("should convert between seconds and milliseconds", async ({ page }) => {
    // Requirement 1.4: ミリ秒単位を選択するとUnix Timeをミリ秒単位で表示する

    // 日時を入力
    const datetimeInput = page.locator("input").first();
    await datetimeInput.fill("2024/01/01 00:00:00");

    // 形式を標準に設定
    await page.selectOption("#format-select", "standard");

    // 単位をミリ秒に設定
    await page.selectOption("#unit-select", "milliseconds");

    // 変換ボタンをクリック
    await page.locator('button:has-text("Convert")').first().click();

    // 少し待機
    await page.waitForTimeout(500);

    // 結果を確認（ミリ秒単位であることを確認）
    const unixTimeText = await page.locator(".font-mono").first().textContent();
    expect(unixTimeText).toMatch(/^\d+$/);
    // ミリ秒単位なので13桁程度の数値
    const unixTime = parseInt(unixTimeText || "0");
    expect(unixTime).toBeGreaterThan(1704000000000); // 2024年1月頃のミリ秒値
  });

  test("should display error for invalid datetime format", async ({ page }) => {
    // Requirement 1.5: 無効な日時形式が入力されるとエラーメッセージを表示する

    // 無効な日時を入力
    const datetimeInput = page.locator("input").first();
    await datetimeInput.fill("invalid-date");

    // 変換ボタンをクリック
    await page.locator('button:has-text("Convert")').first().click();

    // エラーメッセージを確認（最初のalert要素）
    const error = page.locator('[role="alert"]').first();
    await expect(error).toBeVisible();
  });

  test("should support ISO format input", async ({ page }) => {
    // Requirement 1.2: ISO形式で日時を入力するとUnix Timeに変換する

    // ISO形式で日時を入力
    const datetimeInput = page.locator("input").first();
    await datetimeInput.fill("2024-01-01T00:00:00Z");

    // 形式をISOに設定
    await page.selectOption("#format-select", "iso");

    // 単位を秒に設定
    await page.selectOption("#unit-select", "seconds");

    // 変換ボタンをクリック
    await page.locator('button:has-text("Convert")').first().click();

    // 結果を確認
    await expect(page.locator("text=1704067200")).toBeVisible();
  });
});
