# 要件ドキュメント

## はじめに

本ドキュメントは、Data Converter SiteのテストフレームワークをJestからVitestへ移行するための要件を定義します。この移行により、テスト実行速度の向上、設定の簡素化、開発体験の改善を実現します。

## 用語集

- **Test_Framework**: テストの実行、アサーション、モック機能を提供するソフトウェアフレームワーク
- **Vitest**: Viteベースの高速なテストフレームワーク
- **Jest**: JavaScriptのテストフレームワーク（現在使用中）
- **Test_Suite**: プロジェクト内のすべてのテストファイルとテストケースの集合
- **Coverage_Report**: テストがカバーするコードの範囲を示すレポート
- **Property_Based_Test**: fast-checkを使用したランダム入力による網羅的テスト
- **Test_Configuration**: テストフレームワークの動作を制御する設定ファイル
- **Migration_Process**: JestからVitestへの移行作業全体
- **Test_Runner**: テストを実行するプログラム
- **Mock_System**: 依存関係を模擬するための仕組み

## 要件

### 要件1: Vitest依存関係のインストール

**ユーザーストーリー:** 開発者として、Vitestとその関連パッケージをインストールしたい。これにより、Vitestベースのテスト環境を構築できる。

#### 受入基準

1. THE Migration_Process SHALL インストールする vitest パッケージを
2. THE Migration_Process SHALL インストールする @vitest/ui パッケージを
3. THE Migration_Process SHALL インストールする @vitest/coverage-v8 パッケージを
4. THE Migration_Process SHALL インストールする jsdom パッケージを
5. THE Migration_Process SHALL 削除する jest パッケージを
6. THE Migration_Process SHALL 削除する @types/jest パッケージを
7. THE Migration_Process SHALL 削除する jest-environment-jsdom パッケージを
8. THE Migration_Process SHALL 削除する ts-jest パッケージを
9. THE Migration_Process SHALL 保持する @testing-library/react パッケージを
10. THE Migration_Process SHALL 保持する @testing-library/jest-dom パッケージを
11. THE Migration_Process SHALL 保持する fast-check パッケージを

### 要件2: Vitest設定ファイルの作成

**ユーザーストーリー:** 開発者として、Vitest設定ファイルを作成したい。これにより、Vitestの動作をカスタマイズできる。

#### 受入基準

1. THE Migration_Process SHALL 作成する vitest.config.ts ファイルを プロジェクトルートに
2. THE Test_Configuration SHALL 設定する testEnvironment を "jsdom" に
3. THE Test_Configuration SHALL 設定する include パターンを `src/**/*.{test,spec}.{ts,tsx}` に
4. THE Test_Configuration SHALL 設定する exclude パターンを `node_modules`, `dist`, `.next` に
5. THE Test_Configuration SHALL 設定する パスエイリアス `@/*` を `./src/*` に
6. THE Test_Configuration SHALL 設定する globals を true に
7. THE Test_Configuration SHALL 設定する setupFiles を `./vitest.setup.ts` に
8. THE Test_Configuration SHALL 設定する coverage.provider を "v8" に
9. THE Test_Configuration SHALL 設定する coverage.reporter を `["text", "json", "html"]` に
10. THE Test_Configuration SHALL 設定する coverage.exclude を `["**/*.d.ts", "**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/node_modules/**", "**/.next/**"]` に

### 要件3: テストセットアップファイルの移行

**ユーザーストーリー:** 開発者として、テストセットアップファイルをVitest用に変換したい。これにより、テスト実行前の初期化処理を維持できる。

#### 受入基準

1. THE Migration_Process SHALL 作成する vitest.setup.ts ファイルを
2. THE vitest.setup.ts SHALL インポートする @testing-library/jest-dom/vitest を
3. THE Migration_Process SHALL 削除する jest.setup.js ファイルを
4. THE Migration_Process SHALL 削除する jest.config.js ファイルを

### 要件4: package.jsonスクリプトの更新

**ユーザーストーリー:** 開発者として、npmスクリプトをVitest用に更新したい。これにより、既存のコマンドでVitestを実行できる。

#### 受入基準

1. THE Migration_Process SHALL 更新する "test" スクリプトを "vitest --run" に
2. THE Migration_Process SHALL 更新する "test:watch" スクリプトを "vitest" に
3. THE Migration_Process SHALL 更新する "test:coverage" スクリプトを "vitest --coverage" に
4. THE Migration_Process SHALL 追加する "test:ui" スクリプトを "vitest --ui" に
5. THE Migration_Process SHALL 保持する "test:e2e" スクリプトを
6. THE Migration_Process SHALL 保持する "test:e2e:ui" スクリプトを
7. THE Migration_Process SHALL 保持する "test:e2e:headed" スクリプトを

### 要件5: テストファイルのインポート文更新

**ユーザーストーリー:** 開発者として、テストファイルのインポート文を更新したい。これにより、Vitestの型定義を使用できる。

#### 受入基準

1. WHEN テストファイルが `@testing-library/jest-dom` をインポートしている場合、THE Migration_Process SHALL 削除する そのインポート文を
2. WHEN テストファイルが Jest固有の型を使用している場合、THE Migration_Process SHALL 更新する 型定義を Vitest互換に
3. THE Test_Suite SHALL 保持する すべての既存のテストロジックを
4. THE Test_Suite SHALL 保持する fast-checkの使用方法を

### 要件6: next-intlモックの移行

**ユーザーストーリー:** 開発者として、next-intlのモック設定をVitest用に移行したい。これにより、国際化機能を使用するコンポーネントのテストが動作する。

#### 受入基準

1. THE Migration_Process SHALL 保持する src/**mocks**/next-intl ディレクトリを
2. THE Test_Configuration SHALL 設定する next-intl モジュールのモックパスを
3. WHEN テストが next-intl を使用する場合、THE Test_Runner SHALL 適用する モック実装を

### 要件7: すべてのテストの実行と検証

**ユーザーストーリー:** 開発者として、移行後にすべてのテストが正常に実行されることを確認したい。これにより、移行が成功したことを検証できる。

#### 受入基準

1. WHEN `npm run test` を実行した場合、THE Test_Runner SHALL 実行する すべてのテストを
2. WHEN テストが実行された場合、THE Test_Runner SHALL 成功する すべてのテストケースで
3. THE Test_Suite SHALL 含む 14個のテストファイルを
4. THE Test_Suite SHALL 含む コンポーネントテスト 7ファイルを
5. THE Test_Suite SHALL 含む ユーティリティテスト 7ファイルを
6. THE Test_Suite SHALL 含む Property_Based_Test を
7. THE Test_Suite SHALL 含む パフォーマンステストを

### 要件8: カバレッジレポートの生成

**ユーザーストーリー:** 開発者として、カバレッジレポートを生成したい。これにより、テストのカバー範囲を確認できる。

#### 受入基準

1. WHEN `npm run test:coverage` を実行した場合、THE Test_Runner SHALL 生成する Coverage_Report を
2. THE Coverage_Report SHALL 含む テキスト形式のレポートを
3. THE Coverage_Report SHALL 含む JSON形式のレポートを
4. THE Coverage_Report SHALL 含む HTML形式のレポートを
5. THE Coverage_Report SHALL 除外する `**/*.d.ts` ファイルを
6. THE Coverage_Report SHALL 除外する テストファイルを
7. THE Coverage_Report SHALL 除外する `node_modules` ディレクトリを
8. THE Coverage_Report SHALL 除外する `.next` ディレクトリを

### 要件9: 開発体験の向上

**ユーザーストーリー:** 開発者として、Vitestの高度な機能を使用したい。これにより、テスト開発の効率が向上する。

#### 受入基準

1. WHEN `npm run test:ui` を実行した場合、THE Test_Runner SHALL 起動する Vitest UIを
2. THE Vitest UI SHALL 表示する テスト結果を ブラウザで
3. THE Vitest UI SHALL 提供する テストのフィルタリング機能を
4. THE Vitest UI SHALL 提供する テストの再実行機能を
5. WHEN `npm run test:watch` を実行した場合、THE Test_Runner SHALL 監視する ファイル変更を
6. WHEN ファイルが変更された場合、THE Test_Runner SHALL 再実行する 関連するテストを 自動的に

### 要件10: TypeScript型定義の互換性

**ユーザーストーリー:** 開発者として、TypeScriptの型チェックがエラーなく通ることを確認したい。これにより、型安全性が保たれる。

#### 受入基準

1. THE Test_Configuration SHALL 提供する Vitest型定義を グローバルに
2. WHEN TypeScriptコンパイラを実行した場合、THE Test_Suite SHALL 発生させない 型エラーを
3. THE Test_Suite SHALL 使用できる `describe`, `it`, `expect` を 型安全に
4. THE Test_Suite SHALL 使用できる `vi.mock`, `vi.fn` を 型安全に

### 要件11: パフォーマンステストの互換性

**ユーザーストーリー:** 開発者として、パフォーマンステストがVitest上で正常に動作することを確認したい。これにより、パフォーマンス回帰を検出できる。

#### 受入基準

1. WHEN パフォーマンステストを実行した場合、THE Test_Runner SHALL 測定する 実行時間を
2. THE Test_Runner SHALL 提供する タイムアウト設定機能を
3. WHEN 処理時間が閾値を超えた場合、THE Test_Runner SHALL 失敗させる テストを

### 要件12: Property-Based Testの互換性

**ユーザーストーリー:** 開発者として、fast-checkを使用したProperty-Based TestがVitest上で正常に動作することを確認したい。これにより、網羅的なテストを維持できる。

#### 受入基準

1. WHEN Property_Based_Testを実行した場合、THE Test_Runner SHALL 実行する fast-checkのプロパティテストを
2. WHEN プロパティが違反された場合、THE Test_Runner SHALL 報告する 反例を
3. THE Test_Runner SHALL 保持する fast-checkの設定を
4. THE Test_Runner SHALL 保持する シード値による再現性を

### 要件13: ドキュメントの更新

**ユーザーストーリー:** 開発者として、移行に関するドキュメントを更新したい。これにより、チームメンバーが新しいテスト環境を理解できる。

#### 受入基準

1. THE Migration_Process SHALL 更新する README.md を テストコマンドの説明で
2. THE Migration_Process SHALL 作成する 移行完了レポートを
3. THE 移行完了レポート SHALL 含む 移行前後の比較を
4. THE 移行完了レポート SHALL 含む パフォーマンス改善の測定結果を
5. THE 移行完了レポート SHALL 含む 既知の問題と回避策を

### 要件14: 後方互換性の確保

**ユーザーストーリー:** 開発者として、E2Eテスト（Playwright）が影響を受けないことを確認したい。これにより、既存のE2Eテストが継続して動作する。

#### 受入基準

1. THE Migration_Process SHALL 保持する playwright.config.ts を
2. THE Migration_Process SHALL 保持する e2e ディレクトリを
3. WHEN E2Eテストを実行した場合、THE Test_Runner SHALL 実行する Playwrightテストを 正常に
4. THE Migration_Process SHALL 分離する 単体テスト設定と E2Eテスト設定を
