"use client";

import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button className="language-toggle" type="button" onClick={toggleLocale} aria-label="Toggle language">
      <span className={locale === "zh" ? "active" : ""}>中文</span>
      <span>/</span>
      <span className={locale === "en" ? "active" : ""}>EN</span>
    </button>
  );
}
