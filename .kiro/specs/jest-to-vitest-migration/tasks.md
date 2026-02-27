# 実装計画: Jest から Vitest への移行

## 概要

本タスクリストは、Data Converter SiteのテストフレームワークをJestからVitestへ移行するための実装手順を定義します。設計ドキュメントの「移行手順の詳細フロー」に基づき、6つのフェーズに分けて段階的に移行を進めます。

## タスク

- [x] 1. フェーズ1: 準備（推定時間: 15分）
  - [x] 1.1 現在の状態をGitにコミット
    - すべての変更がコミットされていることを確認
    - _Requirements: 移行前の状態保護_
  - [x] 1.2 移行用ブランチの作成
    - ブランチ名: `feature/vitest-migration`
    - _Requirements: 安全な移行作業環境の確保_
  - [x] 1.3 ベースライン測定
    - `npm run test` を実行して現在のテスト実行時間を記録
    - テスト数、カバレッジを記録
    - _Requirements: 移行前後の比較データ取得_

- [x] 2. フェーズ2: 依存関係更新（推定時間: 10分）
  - [x] 2.1 Jest関連パッケージの削除
    - `npm uninstall jest @types/jest jest-environment-jsdom ts-jest` を実行
    - _Requirements: 1.5, 1.6, 1.7, 1.8_
  - [x] 2.2 Vitest関連パッケージの追加
    - `npm install -D vitest @vitest/ui @vitest/coverage-v8 jsdom` を実行
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x] 2.3 package.jsonの依存関係確認
    - Vitestパッケージが追加されていることを確認
    - Jestパッケージが削除されていることを確認
    - @testing-library/react、@testing-library/jest-dom、fast-checkが保持されていることを確認
    - _Requirements: 1.9, 1.10, 1.11_

- [x] 3. フェーズ3: 設定ファイル作成（推定時間: 20分）
  - [x] 3.1 vitest.config.ts の作成
    - プロジェクトルートに `vitest.config.ts` を作成
    - 設定内容: environment: jsdom, globals: true, setupFiles, coverage設定, next-intl inline設定
    - パスエイリアス `@/*` を `./src/*` にマッピング
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 6.2_
  - [x] 3.2 vitest.setup.ts の作成
    - プロジェクトルートに `vitest.setup.ts` を作成
    - `@testing-library/jest-dom/vitest` をインポート
    - _Requirements: 3.1, 3.2_
  - [x] 3.3 package.json スクリプトの更新
    - `"test": "vitest --run"` に更新
    - `"test:watch": "vitest"` に更新
    - `"test:coverage": "vitest --coverage"` に更新
    - `"test:ui": "vitest --ui"` を追加
    - E2Eテストスクリプトは変更しない
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  - [x] 3.4 .kiro/specs/jest-to-vitest-migration/.config.kiro の作成
    - 設定ファイルを作成
    - specId、workflowType、specTypeを設定
    - _Requirements: ワークフロー管理_

- [ ] 4. フェーズ4: テストファイル変換（推定時間: 30分）
  - [x] 4.1 コンポーネントテストファイルの変換（7ファイル）
    - import文を `vitest` に変更
    - `jest.fn()` → `vi.fn()` に置換
    - `jest.mock()` → `vi.mock()` に置換
    - `jest.spyOn()` → `vi.spyOn()` に置換
    - `@testing-library/jest-dom` の直接インポートを削除
    - 対象: Button.test.tsx, ColorConverter.test.tsx, ColorConverter.property.test.tsx, DateTimeConverter.test.tsx, DateTimeConverter.property.test.tsx, InputField.test.tsx, language-switcher.property.test.tsx
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 4.2 ユーティリティテストファイルの変換（7ファイル）
    - import文を `vitest` に変更
    - `jest.fn()` → `vi.fn()` に置換
    - `jest.mock()` → `vi.mock()` に置換
    - `jest.spyOn()` → `vi.spyOn()` に置換
    - 対象: color-utils.test.ts, color-utils.property.test.ts, color-utils.performance.test.ts, datetime-utils.test.ts, datetime-utils.property.test.ts, datetime-utils.performance.test.ts, validation-utils.test.ts
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 4.3 next-intlモックの確認
    - `src/__mocks__/next-intl` ディレクトリが保持されていることを確認
    - モック実装がVitest互換であることを確認
    - _Requirements: 6.1, 6.3_

- [x] 5. チェックポイント - 変換完了確認
  - すべてのテストファイルが変換されたことを確認
  - コメント内の `jest` 文字列が適切に処理されていることを確認
  - ユーザーに質問があれば確認

- [ ] 6. フェーズ5: 動作確認（推定時間: 30分）
  - [x] 6.1 単一テストファイルでの動作確認
    - `npm run test src/components/Button.test.tsx` を実行
    - テストがパスすることを確認
    - _Requirements: 7.1, 7.2_
  - [x] 6.2 全テストの実行
    - `npm run test` を実行
    - 14個のテストファイルすべてが実行されることを確認
    - すべてのテストケースが成功することを確認
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [x] 6.3 プロパティベーステストの動作確認
    - fast-checkを使用したテストが正常に動作することを確認
    - プロパティ違反時に反例が報告されることを確認
    - _Requirements: 7.6, 12.1, 12.2, 12.3, 12.4_
  - [x] 6.4 パフォーマンステストの動作確認
    - パフォーマンステストが実行時間を測定できることを確認
    - タイムアウト設定が機能することを確認
    - _Requirements: 7.7, 11.1, 11.2, 11.3_
  - [x] 6.5 TypeScript型チェック
    - `npx tsc --noEmit` を実行
    - 型エラーが発生しないことを確認
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  - [x] 6.6 カバレッジレポートの生成
    - `npm run test:coverage` を実行
    - テキスト、JSON、HTML形式のレポートが生成されることを確認
    - 除外設定が正しく適用されていることを確認
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_
  - [x] 6.7 Vitest UIモードの動作確認
    - `npm run test:ui` を実行
    - ブラウザでVitest UIが起動することを確認
    - テスト結果が視覚的に表示されることを確認
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  - [x] 6.8 E2Eテストの動作確認
    - `npm run test:e2e` を実行
    - Playwrightテストが正常に実行されることを確認
    - Vitest移行がE2Eテストに影響していないことを確認
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

- [x] 7. チェックポイント - 動作確認完了
  - すべてのテストがパスしたことを確認
  - カバレッジが移行前と同等以上であることを確認
  - ユーザーに質問があれば確認

- [x] 8. フェーズ6: クリーンアップ（推定時間: 15分）
  - [x] 8.1 旧設定ファイルの削除
    - `jest.config.js` を削除
    - `jest.setup.js` を削除
    - _Requirements: 3.3, 3.4_
  - [x] 8.2 移行レポートの作成
    - 移行前後の比較データをまとめる
    - パフォーマンス測定結果を記録
    - 既知の問題と回避策を文書化
    - _Requirements: 13.2, 13.3, 13.4, 13.5_
  - [x] 8.3 README.mdの更新
    - テストコマンドの説明を更新
    - Vitestに関する情報を追加
    - _Requirements: 13.1_
  - [x] 8.4 変更のコミットとプルリクエスト作成
    - すべての変更をコミット
    - プルリクエストを作成してレビュー依頼
    - _Requirements: 移行完了の確認_

- [x] 9. 最終チェックポイント - 移行完了
  - すべてのタスクが完了したことを確認
  - ドキュメントが更新されたことを確認
  - ユーザーに移行完了を報告

## 注意事項

- タスクに `*` が付いているものはオプションで、スキップ可能です
- 各チェックポイントで問題が発生した場合は、前のフェーズに戻って修正してください
- E2Eテスト（Playwright）の設定は変更しないでください
- テストロジックの書き換えは最小限にとどめてください
- 問題が発生した場合は、設計ドキュメントの「エラーハンドリング」セクションを参照してください

## 推定合計時間

約2時間（各フェーズの推定時間の合計）
