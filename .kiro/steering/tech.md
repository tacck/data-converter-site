# 技術スタック

## フレームワーク・ライブラリ

- Next.js 16.1.6 (App Router)
- React 19.2.3
- TypeScript 5.x
- Tailwind CSS 4.x

## ビルドツール

- Next.js (内部でWebpackを使用)
- PostCSS (Tailwind CSS用)
- ESLint 9.x (Next.js設定)

## TypeScript設定

- Strict mode有効
- パスエイリアス: `@/*` → `./src/*`
- Target: ES2017
- JSX: react-jsx

## よく使うコマンド

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# Lint実行
npm run lint
```

## テストフレームワーク

- 単体テスト: 実装予定
- E2Eテスト: Playwright (実装予定)

## スタイリング規約

- Tailwind CSSのユーティリティクラスを使用
- ダークモード対応 (`dark:` prefix)
- カスタムCSS変数: `--background`, `--foreground`
- フォント: Geist Sans, Geist Mono
