# 実装計画: Data Converter Site

## 概要

Data Converter Siteの実装タスクリストです。日時変換機能とカラーコード変換機能を持つWebアプリケーションを、Next.js App RouterとTypeScriptで構築します。国際化対応(英語・日本語)を含みます。

## タスク

- [ ] 1. プロジェクト基盤とユーティリティ関数の実装
  - [x] 1.1 日時変換ユーティリティ関数の実装
    - `src/lib/datetime-utils.ts`を作成
    - `parseDateTime`, `toUnixTime`, `fromUnixTime`, `formatDateTime`, `validateDateTime`関数を実装
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 1.2 日時変換ユーティリティのプロパティテストを作成
    - **Property 1: 日時からUnix Timeへの変換の正確性**
    - **Property 2: Unix Timeから日時への変換の正確性**
    - **Property 3: 日時変換のラウンドトリップ**
    - **Property 4: Unix Time単位変換の一貫性**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4**
  - [x] 1.3 日時変換ユーティリティのユニットテストを作成
    - 具体的な日時の変換例をテスト
    - エポックタイム(1970-01-01)などのエッジケースをテスト
    - 無効な日時形式のエラーハンドリングをテスト
    - _Requirements: 1.5, 2.5_

  - [x] 1.4 カラー変換ユーティリティ関数の実装
    - `src/lib/color-utils.ts`を作成
    - `rgbToHex`, `hexToRgb`, `rgbToCmyk`, `cmykToRgb`, `rgbToHsl`, `hslToRgb`, `validateColorValue`, `formatCss`関数を実装
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6, 4.1, 4.2, 4.3, 4.4, 5.2, 5.3, 5.4, 5.5_
  - [x] 1.5 カラー変換ユーティリティのプロパティテストを作成
    - **Property 5: RGB-HEX変換のラウンドトリップ**
    - **Property 6: ARGB-HEX変換のラウンドトリップ**
    - **Property 7: RGB-CMYK変換のラウンドトリップ**
    - **Property 8: RGB-HSL変換のラウンドトリップ**
    - **Property 9: CSS形式文字列の正確性**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.2, 5.3, 5.4, 5.5**
  - [x] 1.6 カラー変換ユーティリティのユニットテストを作成
    - 具体的な色(赤、黒、白など)の変換例をテスト
    - エッジケース(0, 255の境界値)をテスト
    - 無効なカラーコードのエラーハンドリングをテスト
    - _Requirements: 3.6_

  - [x] 1.7 バリデーションユーティリティの実装
    - `src/lib/validation-utils.ts`を作成
    - 日時とカラーコードのバリデーション関数を実装
    - エラーメッセージ生成関数を実装
    - _Requirements: 1.5, 2.5, 3.6, 9.1, 9.2_

- [ ] 2. 国際化(i18n)の設定
  - [x] 2.1 next-intlのインストールと設定
    - `npm install next-intl`を実行
    - `src/i18n/request.ts`と`src/i18n/routing.ts`を作成
    - ロケール設定(en, ja)を実装
    - _Requirements: 11.1, 11.2, 11.6_
  - [x] 2.2 翻訳ファイルの作成
    - `src/messages/en.json`と`src/messages/ja.json`を作成
    - 共通UI、日時変換、カラー変換、エラーメッセージの翻訳を追加
    - _Requirements: 11.1, 11.2, 11.4, 11.8_
  - [x] 2.3 ロケールベースのルーティング構造を実装
    - `src/app/[locale]/layout.tsx`を作成
    - `src/app/[locale]/page.tsx`を作成
    - next-intlのプロバイダーを設定
    - _Requirements: 11.3, 11.4_

- [ ] 3. 共通コンポーネントの実装
  - [x] 3.1 入力フィールドコンポーネントの作成
    - `src/components/InputField.tsx`を作成
    - ラベル、エラー表示、アクセシビリティ属性を実装
    - _Requirements: 8.1, 8.5, 9.2, 9.3_
  - [x] 3.2 ボタンコンポーネントの作成
    - `src/components/Button.tsx`を作成
    - バリアント(primary, secondary)とアクセシビリティ対応を実装
    - _Requirements: 8.2, 8.6_
  - [x] 3.3 言語切り替えコンポーネントの作成
    - `src/components/LanguageSwitcher.tsx`を作成
    - ロケール切り替えとブラウザストレージへの保存を実装
    - _Requirements: 11.3, 11.4, 11.5_
  - [x] 3.4 言語切り替えのプロパティテストを作成
    - **Property 14: 言語切り替えの一貫性**
    - **Property 15: 言語設定の永続化**
    - **Validates: Requirements 11.4, 11.5, 11.7, 11.8**
  - [x] 3.5 ナビゲーションコンポーネントの作成
    - `src/components/Navigation.tsx`を作成
    - ホーム、日時変換、カラー変換へのリンクを実装
    - _Requirements: 6.3_

- [ ] 4. チェックポイント - 基盤の確認
  - すべてのテストが通ることを確認し、質問があればユーザーに確認してください。

- [ ] 5. 日時変換機能の実装
  - [ ] 5.1 日時変換ページの作成
    - `src/app/[locale]/datetime/page.tsx`を作成
    - ページレイアウトとメタデータを実装
    - _Requirements: 6.1, 6.4_
  - [ ] 5.2 DateTimeConverterコンポーネントの実装
    - `src/components/DateTimeConverter.tsx`を作成
    - 状態管理(useState, useCallback)を実装
    - 日時入力、Unix Time入力、タイムゾーン選択、単位選択UIを実装
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_
  - [ ] 5.3 日時変換のエラーハンドリングを実装
    - バリデーションエラーの表示
    - エラー状態の入力フィールド強調
    - リアルタイムエラー更新
    - _Requirements: 1.5, 2.5, 9.1, 9.2, 9.3, 9.4_
  - [ ]\* 5.4 日時変換のプロパティテストを作成
    - **Property 11: 無効な入力に対するエラーハンドリング(日時)**
    - **Property 12: エラーメッセージの動的更新**
    - **Property 13: 変換処理のエラーキャッチ**
    - **Validates: Requirements 1.5, 2.5, 9.1, 9.4, 9.5**
  - [ ]\* 5.5 日時変換のユニットテストを作成
    - コンポーネントの統合テスト
    - ユーザーインタラクションのテスト
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4_

- [ ] 6. カラー変換機能の実装
  - [ ] 6.1 カラー変換ページの作成
    - `src/app/[locale]/color/page.tsx`を作成
    - ページレイアウトとメタデータを実装
    - _Requirements: 6.2, 6.4_
  - [ ] 6.2 ColorPreviewコンポーネントの作成
    - `src/components/ColorPreview.tsx`を作成
    - リアルタイムカラープレビュー表示を実装
    - _Requirements: 3.5, 4.6_
  - [ ] 6.3 ColorConverterコンポーネントの実装
    - `src/components/ColorConverter.tsx`を作成
    - 状態管理とカラー形式切り替えを実装
    - RGB, ARGB, HEX, CMYK, HSL入力UIを実装
    - リアルタイム変換とプレビュー更新を実装
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  - [ ] 6.4 CSSコピー機能の実装
    - クリップボードAPIを使用したコピー機能
    - 成功メッセージの表示
    - 複数のCSS形式(rgb, rgba, hex, hsl)のサポート
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  - [ ] 6.5 カラー変換のエラーハンドリングを実装
    - バリデーションエラーの表示
    - エラー状態の入力フィールド強調
    - リアルタイムエラー更新
    - _Requirements: 3.6, 9.1, 9.2, 9.3, 9.4_
  - [ ]\* 6.6 カラー変換のプロパティテストを作成
    - **Property 10: カラープレビューの一貫性**
    - **Property 11: 無効な入力に対するエラーハンドリング(カラー)**
    - **Validates: Requirements 3.5, 3.6, 9.1**
  - [ ]\* 6.7 カラー変換のユニットテストを作成
    - コンポーネントの統合テスト
    - ユーザーインタラクションのテスト
    - CSSコピー機能のテスト
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7. チェックポイント - 機能実装の確認
  - すべてのテストが通ることを確認し、質問があればユーザーに確認してください。

- [ ] 8. ホームページとレイアウトの実装
  - [ ] 8.1 ルートレイアウトの更新
    - `src/app/[locale]/layout.tsx`を更新
    - LanguageSwitcherとNavigationを統合
    - グローバルスタイルとメタデータを設定
    - _Requirements: 6.3, 11.3_
  - [ ] 8.2 ホームページの実装
    - `src/app/[locale]/page.tsx`を更新
    - 各機能へのナビゲーションカードを実装
    - 機能説明とリンクを追加
    - _Requirements: 6.3, 6.4_

- [ ] 9. レスポンシブデザインとアクセシビリティの最終調整
  - [ ] 9.1 レスポンシブデザインの実装
    - Tailwind CSSのブレークポイントを使用
    - デスクトップ(1024px+)、タブレット(768-1023px)、モバイル(767px以下)の最適化
    - すべての画面サイズでの操作性を確認
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [ ] 9.2 アクセシビリティの最終確認
    - すべての入力フィールドのラベルとARIA属性を確認
    - キーボードナビゲーションを確認
    - カラーコントラストを確認
    - フォーカス状態の視覚的表示を確認
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [ ] 10. パフォーマンス最適化
  - [ ] 10.1 Reactメモ化の実装
    - `useMemo`と`useCallback`を適切に使用
    - 不要な再レンダリングを防止
    - _Requirements: 10.4_
  - [ ] 10.2 変換処理のパフォーマンス確認
    - 入力変更から結果表示までの時間を測定
    - 100ミリ秒以内の応答を確認
    - _Requirements: 10.1_

- [ ]\* 11. E2Eテストの実装
  - Playwrightを使用したE2Eテストを作成
  - 日時変換のユーザーフローをテスト
  - カラー変換とCSSコピーのユーザーフローをテスト
  - 言語切り替えのフローをテスト
  - _Requirements: 1.1, 2.1, 3.1, 5.1, 11.4_

- [ ] 12. 最終チェックポイント
  - すべてのテストが通ることを確認し、質問があればユーザーに確認してください。

## 注意事項

- `*`マークが付いたタスクはオプションで、より迅速なMVP開発のためにスキップ可能です
- 各タスクは特定の要件を参照しており、トレーサビリティを確保しています
- チェックポイントで段階的な検証を行います
- プロパティテストは普遍的な正確性プロパティを検証します
- ユニットテストは特定の例とエッジケースを検証します
