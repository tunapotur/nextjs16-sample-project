import "server-only"; // Sadece server'da çalış komutu
import type { Locale } from "@/i18n";

const dictionaries = {
  tr: () => import("@/dictionaries/tr.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
} as const;

export async function getDictionary(locale: Locale) {
  const dictLoader = dictionaries[locale] ?? dictionaries.en;
  return dictLoader();
}
