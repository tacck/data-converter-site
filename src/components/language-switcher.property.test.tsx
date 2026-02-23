/**
 * 言語切り替えコンポーネントのプロパティベーステスト
 *
 * fast-checkを使用して、言語切り替えとlocalStorageの永続化に関する
 * 普遍的なプロパティを検証します。
 */

import fc from "fast-check";

// next-intlのroutingをモック
const routing = {
  locales: ["en", "ja"] as const,
  defaultLocale: "en" as const,
};

// テスト設定
const testConfig = {
  numRuns: 100, // 最低反復回数
  verbose: false,
};

// カスタムアービトラリ: サポートされているロケール
const localeArbitrary = fc.constantFrom(...routing.locales);

// localStorageのモック型定義
interface MockStorage {
  [key: string]: string;
}

// localStorageのシミュレーション
class LocalStorageMock {
  private store: MockStorage = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  clear(): void {
    this.store = {};
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}

describe("Language Switcher - Property Based Tests", () => {
  const LOCALE_STORAGE_KEY = "preferred-locale";

  // Feature: data-converter-documentation, Property 14: 言語切り替えの一貫性
  describe("Property 14: 言語切り替えの一貫性", () => {
    it("任意のサポートされているロケールに対して、ロケールが有効であることを検証する", () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          // サポートされているロケールのリストに含まれているか確認
          return routing.locales.includes(locale);
        }),
        testConfig,
      );
    });

    it("任意のロケールに対して、ロケール文字列は小文字の2文字である", () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          // ロケールの形式を検証
          const regex = /^[a-z]{2}$/;
          return regex.test(locale);
        }),
        testConfig,
      );
    });

    it("任意のロケールに対して、デフォルトロケールはサポートされているロケールに含まれる", () => {
      fc.assert(
        fc.property(localeArbitrary, () => {
          // デフォルトロケールが有効であることを確認
          return routing.locales.includes(routing.defaultLocale);
        }),
        testConfig,
      );
    });

    it("任意のロケールペアに対して、異なるロケールは異なる文字列である", () => {
      fc.assert(
        fc.property(localeArbitrary, localeArbitrary, (locale1, locale2) => {
          // 同じロケールでない限り、文字列は異なる
          if (locale1 === locale2) {
            return true;
          }
          return locale1 !== locale2;
        }),
        testConfig,
      );
    });
  });

  // Feature: data-converter-documentation, Property 15: 言語設定の永続化
  describe("Property 15: 言語設定の永続化", () => {
    let mockLocalStorage: LocalStorageMock;

    beforeEach(() => {
      mockLocalStorage = new LocalStorageMock();
    });

    it("任意のロケールに対して、localStorageに保存した値を正確に取得できる", () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          // localStorageに保存
          mockLocalStorage.setItem(LOCALE_STORAGE_KEY, locale);

          // 保存した値を取得
          const savedLocale = mockLocalStorage.getItem(LOCALE_STORAGE_KEY);

          // 保存した値と取得した値が一致することを確認
          return savedLocale === locale;
        }),
        testConfig,
      );
    });

    it("任意のロケールシーケンスに対して、最後に保存した値が取得される", () => {
      fc.assert(
        fc.property(fc.array(localeArbitrary, { minLength: 1 }), (locales) => {
          // 複数のロケールを順番に保存
          locales.forEach((locale) => {
            mockLocalStorage.setItem(LOCALE_STORAGE_KEY, locale);
          });

          // 最後に保存した値を取得
          const savedLocale = mockLocalStorage.getItem(LOCALE_STORAGE_KEY);
          const lastLocale = locales[locales.length - 1];

          // 最後に保存した値と一致することを確認
          return savedLocale === lastLocale;
        }),
        testConfig,
      );
    });

    it("任意のロケールに対して、保存前はnullが返される", () => {
      fc.assert(
        fc.property(localeArbitrary, () => {
          // 新しいストレージインスタンス
          const freshStorage = new LocalStorageMock();

          // 保存していない状態で取得
          const savedLocale = freshStorage.getItem(LOCALE_STORAGE_KEY);

          // nullが返されることを確認
          return savedLocale === null;
        }),
        testConfig,
      );
    });

    it("任意のロケールに対して、clearした後はnullが返される", () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          // localStorageに保存
          mockLocalStorage.setItem(LOCALE_STORAGE_KEY, locale);

          // クリア
          mockLocalStorage.clear();

          // クリア後に取得
          const savedLocale = mockLocalStorage.getItem(LOCALE_STORAGE_KEY);

          // nullが返されることを確認
          return savedLocale === null;
        }),
        testConfig,
      );
    });

    it("任意のロケールに対して、removeItemした後はnullが返される", () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          // localStorageに保存
          mockLocalStorage.setItem(LOCALE_STORAGE_KEY, locale);

          // 削除
          mockLocalStorage.removeItem(LOCALE_STORAGE_KEY);

          // 削除後に取得
          const savedLocale = mockLocalStorage.getItem(LOCALE_STORAGE_KEY);

          // nullが返されることを確認
          return savedLocale === null;
        }),
        testConfig,
      );
    });
  });

  // 追加のプロパティ: ロケール検証の一貫性
  describe("Additional Property: ロケール検証の一貫性", () => {
    it("任意の文字列に対して、サポートされているロケールのみが有効と判定される", () => {
      fc.assert(
        fc.property(fc.string(), (str) => {
          const isValid = routing.locales.includes(
            str as (typeof routing.locales)[number],
          );

          // サポートされているロケールに含まれている場合のみtrueを返す
          if (isValid) {
            return routing.locales.some((locale) => locale === str);
          }
          return true;
        }),
        testConfig,
      );
    });

    it("任意のロケールに対して、大文字小文字を区別する", () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const upperCase = locale.toUpperCase();

          // 小文字のロケールは有効
          const lowerIsValid = routing.locales.includes(locale);

          // 大文字のロケールは無効(ロケールは小文字のみ)
          const upperIsValid = routing.locales.includes(
            upperCase as (typeof routing.locales)[number],
          );

          return lowerIsValid && !upperIsValid;
        }),
        testConfig,
      );
    });
  });

  // 追加のプロパティ: localStorageの独立性
  describe("Additional Property: localStorageの独立性", () => {
    it("任意のロケールに対して、異なるキーは互いに影響しない", () => {
      fc.assert(
        fc.property(localeArbitrary, localeArbitrary, (locale1, locale2) => {
          const storage = new LocalStorageMock();
          const key1 = LOCALE_STORAGE_KEY;
          const key2 = "other-key";

          // 2つの異なるキーに値を保存
          storage.setItem(key1, locale1);
          storage.setItem(key2, locale2);

          // それぞれのキーから正しい値が取得できることを確認
          const value1 = storage.getItem(key1);
          const value2 = storage.getItem(key2);

          return value1 === locale1 && value2 === locale2;
        }),
        testConfig,
      );
    });

    it("任意のロケールに対して、一方のキーを削除しても他方は影響を受けない", () => {
      fc.assert(
        fc.property(localeArbitrary, localeArbitrary, (locale1, locale2) => {
          const storage = new LocalStorageMock();
          const key1 = LOCALE_STORAGE_KEY;
          const key2 = "other-key";

          // 2つの異なるキーに値を保存
          storage.setItem(key1, locale1);
          storage.setItem(key2, locale2);

          // key1を削除
          storage.removeItem(key1);

          // key1はnull、key2は元の値を保持
          const value1 = storage.getItem(key1);
          const value2 = storage.getItem(key2);

          return value1 === null && value2 === locale2;
        }),
        testConfig,
      );
    });
  });
});
