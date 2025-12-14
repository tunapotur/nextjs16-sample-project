export const i18n = {
  locales: ["tr", "en"],
  defaultLocale: "en",
} as const;

export type Locale = (typeof i18n)["locales"][number];
