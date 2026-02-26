# E2Eテスト

このディレクトリには、Data Converter SiteのE2E（End-to-End）テストが含まれています。

## テストファイル

### 1. datetime-conversion.spec.ts

日時変換機能のユーザーフローをテストします。

**カバーする要件:**

- 要件1.1: YYYY/mm/DD HH:MM:SS形式からUnix Timeへの変換
- 要件1.2: ISO形式からUnix Timeへの変換
- 要件1.3: タイムゾーンを考慮した変換
- 要件1.4: 秒・ミリ秒単位の切り替え
- 要件1.5: 無効な日時形式のエラーハンドリング
- 要件2.1: Unix Timeから日時への変換

**テストケース:**

- 日時からUnix Time（秒）への変換
- Unix Timeから日時への変換
- タイムゾーン変換の正確性
- 秒とミリ秒の単位変換
- 無効な日時形式のエラー表示
- ISO形式のサポート

### 2. color-conversion.spec.ts

カラー変換とCSSコピー機能のユーザーフローをテストします。

**カバーする要件:**

- 要件3.1: RGB数値からHEXへの変換
- 要件3.2: HEXからRGB数値への変換
- 要件3.3, 3.4: ARGB値とHEXの相互変換
- 要件3.5: リアルタイムカラープレビュー
- 要件3.6: 無効なカラーコードのエラーハンドリング
- 要件4.1, 4.2: RGB-CMYK相互変換
- 要件4.3, 4.4: RGB-HSL相互変換
- 要件5.1: CSSコピー機能
- 要件5.2, 5.3, 5.4, 5.5: 複数のCSS形式のサポート

**テストケース:**

- RGBからHEXへの変換
- リアルタイムカラープレビュー
- CSSクリップボードコピー
- HEXからRGBへの変換
- ARGBとアルファチャンネルの処理
- RGBとHSLの相互変換
- RGBとCMYKの相互変換
- 無効なカラー値のエラー表示
- 複数のCSS形式でのコピー

### 3. language-switching.spec.ts

言語切り替え機能のユーザーフローをテストします。

**カバーする要件:**

- 要件11.4: 言語切り替え時のUIテキスト更新
- 要件11.5: 言語設定の永続化
- 要件11.8: エラーメッセージの多言語対応

**テストケース:**

- 英語から日本語への切り替え
- 日本語から英語への切り替え
- 日時変換ページでの言語設定維持
- カラー変換ページでの言語設定維持
- 選択された言語でのエラーメッセージ表示
- ページリロード後の言語設定維持
- 日時変換ページでの言語切り替え
- ナビゲーションリンクの多言語表示
- カラー変換ページでの言語切り替え

## テストの実行方法

### 前提条件

- Node.js 20以上
- npm 10以上
- Playwrightのインストール（初回のみ）

### 初回セットアップ

```bash
# 依存関係のインストール
npm install

# Playwrightブラウザのインストール
npx playwright install chromium
```

### テスト実行コマンド

#### すべてのE2Eテストを実行

```bash
npm run test:e2e
```

#### UIモードでテストを実行（デバッグに便利）

```bash
npm run test:e2e:ui
```

#### ヘッドモードでテストを実行（ブラウザを表示）

```bash
npm run test:e2e:headed
```

#### 特定のテストファイルのみ実行

```bash
npx playwright test e2e/datetime-conversion.spec.ts
npx playwright test e2e/color-conversion.spec.ts
npx playwright test e2e/language-switching.spec.ts
```

#### 特定のテストケースのみ実行

```bash
npx playwright test -g "should convert datetime to Unix time"
```

### テスト結果の確認

テスト実行後、HTMLレポートを表示できます：

```bash
npx playwright show-report
```

## テスト設定

テスト設定は `playwright.config.ts` で管理されています。

**主な設定:**

- ベースURL: `http://localhost:3000`
- ブラウザ: Chromium
- 開発サーバー: 自動起動
- リトライ: CI環境では2回
- タイムアウト: デフォルト30秒

## トラブルシューティング

### 開発サーバーが起動しない

手動で開発サーバーを起動してからテストを実行してください：

```bash
# ターミナル1
npm run dev

# ターミナル2
npm run test:e2e
```

### テストがタイムアウトする

`playwright.config.ts` でタイムアウト設定を調整できます：

```typescript
use: {
  actionTimeout: 10000, // アクション単位のタイムアウト
  navigationTimeout: 30000, // ナビゲーションのタイムアウト
}
```

### ブラウザが見つからない

Playwrightブラウザを再インストールしてください：

```bash
npx playwright install --force chromium
```

## CI/CD統合

GitHub ActionsなどのCI環境でテストを実行する場合：

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E tests
  run: npm run test:e2e
```

## ベストプラクティス

1. **テストの独立性**: 各テストは独立して実行可能であるべき
2. **明確なセレクタ**: IDやdata-testid属性を使用して要素を特定
3. **待機戦略**: `waitForLoadState('networkidle')` を使用してページの完全なロードを待機
4. **エラーハンドリング**: エラーケースも必ずテスト
5. **多言語対応**: 両方の言語でテストを実行

## 今後の改善

- [ ] より多くのエッジケースのカバレッジ
- [ ] パフォーマンステストの追加
- [ ] アクセシビリティテストの統合
- [ ] ビジュアルリグレッションテストの追加
- [ ] モバイルビューポートでのテスト
