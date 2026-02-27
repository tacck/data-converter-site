# Jest から Vitest への移行計画

## 1. 現状分析

### 1.1 現在のテスト構成

#### テストフレームワーク

- **単体テスト**: Jest 30.2.0 + ts-jest 29.4.6
- **E2Eテスト**: Playwright 1.58.2 (移行対象外)

#### テストの種類と数

```
src/
├── components/
│   ├── Button.test.tsx
│   ├── ColorConverter.test.tsx
│   ├── ColorConverter.property.test.tsx
│   ├── DateTimeConverter.test.tsx
│   ├── DateTimeConverter.property.test.tsx
│   ├── InputField.test.tsx
│   ├── language-switcher.property.test.tsx
│   └── (7ファイル)
├── lib/
│   ├── color-utils.test.ts
│   ├── color-utils.property.test.ts
│   ├── color-utils.performance.test.ts
│   ├── datetime-utils.test.ts
│   ├── datetime-utils.property.test.ts
│   ├── datetime-utils.performance.test.ts
│   ├── validation-utils.test.ts
│   └── (7ファイル)
└── __mocks__/
    └── next-intl.tsx
```

**合計**: 14テストファイル

#### 使用ライブラリ

- `@testing-library/react`: 16.3.2
- `@testing-library/jest-dom`: 6.9.1
- `@testing-library/user-event`: 14.6.1
- `fast-check`: 4.5.3 (プロパティベーステスト)
- `jest-environment-jsdom`: 30.2.0

#### Jest設定の特徴

```javascript
// jest.config.js
{
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/(?!(next-intl|use-intl)/)'],
  transform: { '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react' } }] }
}
```

### 1.2 テストパターンの分類

#### A. 標準的なReactコンポーネントテスト

- `Button.test.tsx`
- `InputField.test.tsx`
- `ColorConverter.test.tsx`
- `DateTimeConverter.test.tsx`

**特徴**:

- `@testing-library/react`を使用
- `fireEvent`, `waitFor`, `screen`を使用
- `jest.fn()`でモック関数を作成

#### B. プロパティベーステスト

- `*.property.test.tsx/ts` (4ファイル)

**特徴**:

- `fast-check`を使用
- `fc.assert`, `fc.property`を使用
- 大量のランダムデータでテスト

#### C. パフォーマンステスト

- `*.performance.test.ts` (2ファイル)

**特徴**:

- `performance.now()`を使用
- 実行時間を測定

#### D. ユーティリティ関数テスト

- `color-utils.test.ts`
- `datetime-utils.test.ts`
- `validation-utils.test.ts`

**特徴**:

- 純粋な関数のテスト
- モックなし

#### E. Next.js/next-intlのモック

- `src/__mocks__/next-intl.tsx`

**特徴**:

- `next-intl`のモック実装
- `transformIgnorePatterns`で特別扱い

---

## 2. Vitestの特徴と利点

### 2.1 Vitestの主な利点

1. **高速な実行速度**
   - Viteの高速なHMRとトランスフォーム機能を活用
   - ESMネイティブサポート
   - 並列実行のデフォルト有効化

2. **Jest互換API**
   - `describe`, `it`, `expect`などのAPIがほぼ同じ
   - `jest.fn()`の代わりに`vi.fn()`を使用
   - マイグレーションが比較的容易

3. **設定の簡素化**
   - Vite設定を再利用可能
   - TypeScriptのトランスパイルが不要(Viteが処理)
   - `ts-jest`が不要

4. **開発体験の向上**
   - ウォッチモードが高速
   - UIモード(`vitest --ui`)でテスト結果を可視化
   - カバレッジレポートの統合

### 2.2 Vitestの制約

1. **jsdom環境**
   - `@vitest/browser`または`happy-dom`が必要
   - 設定が若干異なる

2. **モックの違い**
   - `jest.mock()`の代わりに`vi.mock()`
   - `jest.fn()`の代わりに`vi.fn()`
   - 一部のモック機能が異なる

---

## 3. 移行対応箇所

### 3.1 設定ファイル

#### 削除するファイル

- `jest.config.js`
- `jest.setup.js`

#### 作成するファイル

- `vitest.config.ts`
- `vitest.setup.ts`

### 3.2 package.json

#### 削除する依存関係

```json
{
  "devDependencies": {
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0",
    "ts-jest": "^29.4.6",
    "@types/jest": "^30.0.0"
  }
}
```

#### 追加する依存関係

```json
{
  "devDependencies": {
    "vitest": "^2.1.0",
    "@vitest/ui": "^2.1.0",
    "jsdom": "^25.0.0",
    "@vitest/coverage-v8": "^2.1.0"
  }
}
```

#### スクリプトの変更

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 3.3 テストファイルの修正

#### 全ファイル共通の変更

**Before (Jest)**:

```typescript
import { describe, it, expect, jest } from "@jest/globals";
const mockFn = jest.fn();
jest.mock("module-name");
```

**After (Vitest)**:

```typescript
import { describe, it, expect, vi } from "vitest";
const mockFn = vi.fn();
vi.mock("module-name");
```

#### 対象ファイル一覧

1. `src/components/Button.test.tsx`
2. `src/components/ColorConverter.test.tsx`
3. `src/components/ColorConverter.property.test.tsx`
4. `src/components/DateTimeConverter.test.tsx`
5. `src/components/DateTimeConverter.property.test.tsx`
6. `src/components/InputField.test.tsx`
7. `src/components/language-switcher.property.test.tsx`
8. `src/lib/color-utils.test.ts`
9. `src/lib/color-utils.property.test.ts`
10. `src/lib/color-utils.performance.test.ts`
11. `src/lib/datetime-utils.test.ts`
12. `src/lib/datetime-utils.property.test.ts`
13. `src/lib/datetime-utils.performance.test.ts`
14. `src/lib/validation-utils.test.ts`

### 3.4 モックファイルの修正

#### `src/__mocks__/next-intl.tsx`

- Vitestのモックシステムに対応
- `vi.mock()`を使用する形式に変更

---

## 4. 対応難易度の分類

### レベル1: 簡単 (自動置換可能)

**対象**: 全14ファイル

**作業内容**:

- `import { jest } from "@jest/globals"` → `import { vi } from "vitest"`
- `jest.fn()` → `vi.fn()`
- `jest.mock()` → `vi.mock()`

**推定時間**: 30分

---

### レベル2: 中程度 (設定ファイル作成)

**対象**: 設定ファイル

**作業内容**:

1. `vitest.config.ts`の作成
   - パスエイリアス設定(`@/*`)
   - jsdom環境設定
   - setupFilesの指定
   - カバレッジ設定

2. `vitest.setup.ts`の作成
   - `@testing-library/jest-dom`のインポート
   - グローバル設定

**推定時間**: 1時間

---

### レベル3: やや難しい (モック処理の調整)

**対象**:

- `src/__mocks__/next-intl.tsx`
- `next-intl`を使用するテストファイル

**作業内容**:

- Vitestのモックシステムに合わせた調整
- `transformIgnorePatterns`の代替設定
- ESMモジュールのモック方法の変更

**推定時間**: 2時間

---

### レベル4: 難しい (パフォーマンステストの検証)

**対象**:

- `src/lib/color-utils.performance.test.ts`
- `src/lib/datetime-utils.performance.test.ts`

**作業内容**:

- `performance.now()`の動作確認
- Vitestでの実行時間測定の精度確認
- 必要に応じてベンチマーク方法の変更

**推定時間**: 1時間

---

## 5. 移行ステップ

### フェーズ1: 準備 (推定時間: 1時間)

#### ステップ1.1: 依存関係の更新

```bash
# Jest関連パッケージの削除
npm uninstall jest jest-environment-jsdom ts-jest @types/jest

# Vitest関連パッケージのインストール
npm install -D vitest @vitest/ui jsdom @vitest/coverage-v8
```

#### ステップ1.2: 設定ファイルの作成

**`vitest.config.ts`**:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**`vitest.setup.ts`**:

```typescript
import "@testing-library/jest-dom/vitest";
```

#### ステップ1.3: package.jsonの更新

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

### フェーズ2: テストファイルの一括変換 (推定時間: 30分)

#### ステップ2.1: importの一括置換

**対象**: 全14テストファイル

**置換パターン**:

```bash
# jest → vitest
find src -name "*.test.ts*" -exec sed -i '' 's/@jest\/globals/vitest/g' {} +

# jest.fn() → vi.fn()
find src -name "*.test.ts*" -exec sed -i '' 's/jest\.fn()/vi.fn()/g' {} +

# jest.mock() → vi.mock()
find src -name "*.test.ts*" -exec sed -i '' 's/jest\.mock(/vi.mock(/g' {} +
```

**手動確認が必要な箇所**:

- `jest`という変数名が使われている場合
- コメント内の`jest`

---

### フェーズ3: モックの調整 (推定時間: 2時間)

#### ステップ3.1: next-intlモックの更新

**`src/__mocks__/next-intl.tsx`の修正**:

```typescript
// Vitest用のモック実装に変更
import { vi } from "vitest";

// モック実装...
```

#### ステップ3.2: vitest.config.tsでのESM対応

```typescript
export default defineConfig({
  test: {
    // ...
    server: {
      deps: {
        inline: ["next-intl", "use-intl"],
      },
    },
  },
});
```

---

### フェーズ4: 動作確認とデバッグ (推定時間: 2時間)

#### ステップ4.1: 全テストの実行

```bash
npm run test
```

#### ステップ4.2: 失敗したテストの修正

- エラーメッセージを確認
- モックの動作を確認
- 必要に応じて個別に修正

#### ステップ4.3: カバレッジの確認

```bash
npm run test:coverage
```

#### ステップ4.4: パフォーマンステストの検証

- 実行時間の測定が正しく動作するか確認
- 必要に応じてベンチマーク方法を調整

---

### フェーズ5: クリーンアップ (推定時間: 30分)

#### ステップ5.1: 不要ファイルの削除

```bash
rm jest.config.js
rm jest.setup.js
```

#### ステップ5.2: ドキュメントの更新

- `README.md`のテストコマンドを更新
- `.kiro/steering/tech.md`の更新

#### ステップ5.3: CIの更新(該当する場合)

- GitHub ActionsなどのCI設定を更新

---

## 6. リスクと対策

### リスク1: next-intlのモックが動作しない

**影響度**: 高  
**発生確率**: 中

**対策**:

- Vitestの`server.deps.inline`オプションを使用
- 必要に応じて`vi.mock()`の実装を調整
- 最悪の場合、該当テストを一時的にスキップ

### リスク2: パフォーマンステストの精度低下

**影響度**: 低  
**発生確率**: 低

**対策**:

- `performance.now()`の動作を事前に確認
- 必要に応じて`vitest-bench`を使用
- 閾値を調整

### リスク3: fast-checkとの互換性問題

**影響度**: 中  
**発生確率**: 低

**対策**:

- fast-checkはテストランナーに依存しないため問題なし
- 念のため事前に動作確認

### リスク4: @testing-library/jest-domの互換性

**影響度**: 低  
**発生確率**: 極低

**対策**:

- `@testing-library/jest-dom/vitest`をインポート
- 公式にVitest対応済み

---

## 7. 移行後の確認事項

### 7.1 機能確認

- [ ] 全テストがパスする
- [ ] カバレッジレポートが生成される
- [ ] ウォッチモードが動作する
- [ ] UIモードが動作する

### 7.2 パフォーマンス確認

- [ ] テスト実行時間がJestと同等以下
- [ ] ウォッチモードの反応速度が向上

### 7.3 開発体験確認

- [ ] エラーメッセージが分かりやすい
- [ ] デバッグが容易
- [ ] IDEとの統合が問題ない

---

## 8. 推定工数まとめ

| フェーズ  | 作業内容               | 難易度    | 推定時間  |
| --------- | ---------------------- | --------- | --------- |
| フェーズ1 | 準備(依存関係・設定)   | レベル2   | 1時間     |
| フェーズ2 | テストファイル一括変換 | レベル1   | 30分      |
| フェーズ3 | モック調整             | レベル3   | 2時間     |
| フェーズ4 | 動作確認・デバッグ     | レベル3-4 | 2時間     |
| フェーズ5 | クリーンアップ         | レベル1   | 30分      |
| **合計**  |                        |           | **6時間** |

---

## 9. 参考資料

### 公式ドキュメント

- [Vitest公式ドキュメント](https://vitest.dev/)
- [JestからVitestへの移行ガイド](https://vitest.dev/guide/migration.html)
- [Vitest API Reference](https://vitest.dev/api/)

### 関連ライブラリ

- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
- [fast-check](https://fast-check.dev/)

---

## 10. 結論

Jest から Vitest への移行は、以下の理由から**実施を推奨**します:

### 推奨理由

1. **高速化**: テスト実行速度とウォッチモードの反応速度が向上
2. **設定の簡素化**: ts-jestが不要になり、設定がシンプルに
3. **開発体験の向上**: UIモードなど、より良いツールが利用可能
4. **移行コスト**: 約6時間で完了可能な低リスクな移行

### 移行の容易さ

- **API互換性**: Jestとほぼ同じAPIのため学習コスト低
- **テスト数**: 14ファイルと規模が小さく、一括変換が可能
- **依存関係**: 既存のテストライブラリ(Testing Library, fast-check)がそのまま使用可能

### 注意点

- next-intlのモック処理に若干の調整が必要
- パフォーマンステストの動作確認が必要
- E2Eテスト(Playwright)は移行対象外

**総合評価**: 移行難易度は「中」、メリットは「大」
