# プロジェクト構造

## ディレクトリ構成

```
.
├── src/
│   └── app/              # Next.js App Router
│       ├── layout.tsx    # ルートレイアウト
│       ├── page.tsx      # トップページ
│       ├── globals.css   # グローバルスタイル
│       └── favicon.ico
├── public/               # 静的ファイル
├── docs/                 # ドキュメント (作成予定)
│   └── features/         # 機能別詳細ドキュメント
├── .kiro/
│   ├── settings/         # Kiro設定
│   └── steering/         # ステアリングルール
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── BASE.md               # プロジェクト要件定義
```

## App Router構造

- `src/app/` 配下にページとレイアウトを配置
- 各機能は独立したルート(ディレクトリ)として実装
- 例: `/datetime`, `/color` など

## コンポーネント配置 (予定)

- `src/components/` - 共通コンポーネント
- `src/app/[feature]/` - 機能固有のコンポーネント

## ドキュメント配置

- `docs/architecture.md` - アーキテクチャドキュメント
- `docs/features/[feature-name]/` - 機能別詳細ドキュメント
  - 機能概要、フローチャート、シーケンス図、状態遷移図など
- 図はMermaid形式で記述

## 命名規則

- ファイル名: kebab-case (例: `color-converter.tsx`)
- コンポーネント名: PascalCase (例: `ColorConverter`)
- 関数・変数: camelCase (例: `convertToHex`)
- 定数: UPPER_SNAKE_CASE (例: `MAX_RGB_VALUE`)
