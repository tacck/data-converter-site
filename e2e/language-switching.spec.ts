import { test, expect } from "@playwright/test";

/**
 * E2E Test: Language Switching User Flow
 * Validates Requirements: 11.4
 */

test.describe("Language Switching", () => {
  test("should switch from English to Japanese", async ({ page }) => {
    // Requirement 11.4: ユーザーが言語を切り替えると、
    // SystemはすべてのUIテキストを選択された言語で表示する

    // 英語ページにアクセス
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // 英語のUIテキストを確認
    await expect(page.locator("h1")).toContainText(/Data Converter/i);

    // 言語切り替えセレクトボックスで日本語を選択
    await page.selectOption("#language-select", "ja");

    // 日本語ページにリダイレクトされることを確認
    await page.waitForURL(/\/ja/);

    // 日本語のUIテキストを確認
    await expect(page.locator("h1")).toContainText(/データ変換/);
  });

  test("should switch from Japanese to English", async ({ page }) => {
    // 日本語ページにアクセス
    await page.goto("/ja");
    await page.waitForLoadState("networkidle");

    // 日本語のUIテキストを確認
    await expect(page.locator("h1")).toContainText(/データ変換/);

    // 言語切り替えセレクトボックスで英語を選択
    await page.selectOption("#language-select", "en");

    // 英語ページにリダイレクトされることを確認
    await page.waitForURL(/\/en/);

    // 英語のUIテキストを確認
    await expect(page.locator("h1")).toContainText(/Data Converter/i);
  });

  test("should maintain language preference on datetime page", async ({
    page,
  }) => {
    // 日本語でホームページにアクセス
    await page.goto("/ja");
    await page.waitForLoadState("networkidle");

    // 日時変換ページに移動
    await page.click('a[href="/ja/datetime"]');
    await page.waitForURL(/\/ja\/datetime/);

    // URLとUIが日本語であることを確認
    await expect(page).toHaveURL(/\/ja\/datetime/);
    await expect(page.locator("h2")).toContainText(/日時変換/);
  });

  test("should maintain language preference on color page", async ({
    page,
  }) => {
    // 英語でホームページにアクセス
    await page.goto("/en");
    await page.waitForLoadState("networkidle");

    // カラー変換ページに移動
    await page.click('a[href="/en/color"]');
    await page.waitForURL(/\/en\/color/);

    // URLとUIが英語であることを確認
    await expect(page).toHaveURL(/\/en\/color/);
    await expect(page.locator("h2")).toContainText(/Color Converter/i);
  });

  test("should display error messages in selected language", async ({
    page,
  }) => {
    // Requirement 11.8: エラーメッセージを選択された言語で表示する

    // 日本語で日時変換ページにアクセス
    await page.goto("/ja/datetime");
    await page.waitForLoadState("networkidle");

    // 無効な日時を入力
    const datetimeInput = page.locator("input").first();
    await datetimeInput.fill("invalid");

    // 変換ボタンをクリック
    await page.locator('button:has-text("変換")').first().click();

    // 日本語のエラーメッセージを確認
    const error = page.locator('[role="alert"]');
    await expect(error).toBeVisible();
  });

  test("should persist language preference after page reload", async ({
    page,
  }) => {
    // Requirement 11.5: ユーザーの言語選択をブラウザに保存する

    // 日本語ページにアクセス
    await page.goto("/ja");
    await page.waitForLoadState("networkidle");

    // ページをリロード
    await page.reload();
    await page.waitForLoadState("networkidle");

    // 日本語が維持されていることを確認
    await expect(page).toHaveURL(/\/ja/);
    await expect(page.locator("h1")).toContainText(/データ変換/);
  });

  test("should switch language on datetime page", async ({ page }) => {
    // 英語で日時変換ページにアクセス
    await page.goto("/en/datetime");
    await page.waitForLoadState("networkidle");

    // 英語のUIを確認
    await expect(page.locator("h2")).toContainText(/DateTime Converter/i);

    // 言語を日本語に切り替え
    await page.selectOption("#language-select", "ja");

    // 日本語ページにリダイレクトされることを確認
    await page.waitForURL(/\/ja\/datetime/);
    await expect(page.locator("h2")).toContainText(/日時変換/);
  });

  test("should display navigation links in selected language", async ({
    page,
  }) => {
    // 日本語ページにアクセス
    await page.goto("/ja");
    await page.waitForLoadState("networkidle");

    // ナビゲーションリンクが日本語であることを確認
    const nav = page.locator("nav");
    await expect(nav).toContainText(/ホーム/);
    await expect(nav).toContainText(/日時変換/);
    await expect(nav).toContainText(/カラー変換/);

    // 英語に切り替え
    await page.selectOption("#language-select", "en");
    await page.waitForURL(/\/en/);

    // ナビゲーションリンクが英語であることを確認
    await expect(nav).toContainText(/Home/i);
    await expect(nav).toContainText(/DateTime/i);
    await expect(nav).toContainText(/Color/i);
  });

  test("should switch language on color page", async ({ page }) => {
    // 英語でカラー変換ページにアクセス
    await page.goto("/en/color");
    await page.waitForLoadState("networkidle");

    // 英語のUIを確認
    await expect(page.locator("h2")).toContainText(/Color Converter/i);

    // 言語を日本語に切り替え
    await page.selectOption("#language-select", "ja");

    // 日本語ページにリダイレクトされることを確認
    await page.waitForURL(/\/ja\/color/);
    await expect(page.locator("h2")).toContainText(/カラー変換/);
  });
});
