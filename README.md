# Data Converter Site

シンプルなデータ変換機能を提供するWebアプリケーション。

## 主要機能

- **日時変換**: Unix Time(エポックタイム)と一般的な日時形式の相互変換
- **カラーコード変換**: RGB、ARGB、CMYK、HSL形式の相互変換

## Getting Started

開発サーバーを起動:

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## テスト

このプロジェクトは [Vitest](https://vitest.dev/) を使用してテストを実行します。

### テストコマンド

```bash
# すべてのテストを1回実行
npm run test

# ウォッチモードでテストを実行（ファイル変更時に自動再実行）
npm run test:watch

# カバレッジレポートを生成
npm run test:coverage

# UIモードでテストを実行（ブラウザベースのインターフェース）
npm run test:ui

# E2Eテストを実行（Playwright）
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
```

### テストの種類

- **単体テスト**: コンポーネントとユーティリティ関数のテスト（14ファイル、264テストケース）
- **プロパティベーステスト**: [fast-check](https://github.com/dubzzz/fast-check)を使用した網羅的テスト
- **パフォーマンステスト**: 処理時間の測定とパフォーマンス回帰の検出
- **E2Eテスト**: [Playwright](https://playwright.dev/)を使用したエンドツーエンドテスト

### Vitestの特徴

- **高速**: Viteベースの高速なテスト実行
- **ウォッチモード**: ファイル変更時の自動再実行
- **UIモード**: ブラウザベースのテストインターフェース
- **TypeScript対応**: ネイティブTypeScriptサポート
- **カバレッジ**: v8カバレッジプロバイダーによる詳細な分析

詳細は [docs/vitest-migration-report.md](docs/vitest-migration-report.md) を参照してください。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
