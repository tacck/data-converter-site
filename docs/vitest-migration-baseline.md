# Jest to Vitest 移行 - ベースライン測定結果

## 測定日時

2025年2月27日

## 測定環境

- ブランチ: feature/vitest-migration
- テストフレームワーク: Jest 30.2.0
- Node.js: (実行環境)

## テスト実行結果

### 実行時間

- **合計実行時間**: 2.266秒

### テストスイート

- **合計**: 14 test suites
- **成功**: 14 passed
- **失敗**: 0 failed

### テストケース

- **合計**: 264 tests
- **成功**: 264 passed
- **失敗**: 0 failed

### スナップショット

- **合計**: 0 total

## テストファイル一覧

### コンポーネントテスト (7ファイル)

1. ✅ src/components/Button.test.tsx
2. ✅ src/components/ColorConverter.test.tsx
3. ✅ src/components/ColorConverter.property.test.tsx
4. ✅ src/components/DateTimeConverter.test.tsx
5. ✅ src/components/DateTimeConverter.property.test.tsx
6. ✅ src/components/InputField.test.tsx
7. ✅ src/components/language-switcher.property.test.tsx

### ユーティリティテスト (7ファイル)

1. ✅ src/lib/color-utils.test.ts
2. ✅ src/lib/color-utils.property.test.ts
3. ✅ src/lib/color-utils.performance.test.ts
4. ✅ src/lib/datetime-utils.test.ts
5. ✅ src/lib/datetime-utils.property.test.ts
6. ✅ src/lib/datetime-utils.performance.test.ts
7. ✅ src/lib/validation-utils.test.ts

## 移行後の目標

### パフォーマンス改善目標

- 初回実行時間: -30% (目標: 1.6秒以下)
- 2回目実行時間: -50% (目標: 1.1秒以下)
- ウォッチモード反応時間: -60%

### 品質維持目標

- テストスイート数: 14 (変更なし)
- テストケース数: 264 (変更なし)
- 成功率: 100% (維持)

## 備考

- すべてのテストが正常にパスしている
- プロパティベーステスト (4ファイル) が正常に動作している
- パフォーマンステスト (2ファイル) が正常に動作している
- 移行前の状態は良好
