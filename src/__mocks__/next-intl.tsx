import React from "react";

// next-intlのモック
export const useTranslations = (namespace?: string) => {
  return (key: string) => {
    // テスト用のメッセージを返す
    const messages: Record<string, any> = {
      "datetime.title": "DateTime Converter",
      "datetime.toUnixTime": "DateTime to Unix Time",
      "datetime.fromUnixTime": "Unix Time to DateTime",
      "datetime.inputLabel": "Input",
      "datetime.outputLabel": "Output",
      "datetime.datetimeInput": "DateTime",
      "datetime.unixTimeInput": "Unix Time",
      "datetime.timezone": "Timezone",
      "datetime.unit": "Unit",
      "datetime.format": "Format",
      "datetime.seconds": "Seconds",
      "datetime.milliseconds": "Milliseconds",
      "datetime.standard": "Standard (YYYY/mm/DD HH:MM:SS)",
      "datetime.iso": "ISO 8601",
      "datetime.convert": "Convert",
      "datetime.placeholder.datetime": "2024/01/01 12:00:00",
      "datetime.placeholder.unixTime": "1704067200",
      "datetime.description.toUnixTime":
        "Convert human-readable datetime to Unix Time",
      "datetime.description.fromUnixTime":
        "Convert Unix Time to human-readable datetime",
      "errors.invalidDateTime":
        "無効な日時形式です。YYYY/mm/DD HH:MM:SS形式で入力してください。",
      "errors.invalidUnixTime":
        "無効なUnix Time値です。数値を入力してください。",
      "errors.conversionError":
        "変換中にエラーが発生しました。入力値を確認してください。",
    };

    const fullKey = namespace ? `${namespace}.${key}` : key;
    return messages[fullKey] || key;
  };
};

export const NextIntlClientProvider: React.FC<{
  locale: string;
  messages: any;
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export const useLocale = () => "en";
export const useMessages = () => ({});
export const useFormatter = () => ({});
