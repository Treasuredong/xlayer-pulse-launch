"use client";

import { useLanguage } from "@/components/language-provider";

export function QuickStart() {
  const { t } = useLanguage();

  return (
    <section className="container">
      <div className="section-topbar">
        <h2 className="section-title">{t.quickStart.title}</h2>
        <span className="helper">{t.quickStart.subtitle}</span>
      </div>
      <div className="quickstart-grid">
        {t.quickStart.steps.map((step, index) => (
          <article className="quickstart-card" key={step.title}>
            <span className="quickstart-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.copy}</p>
          </article>
        ))}
        <aside className="quickstart-card quickstart-highlight">
          <span className="quickstart-index">GO</span>
          <h3>{t.quickStart.ctaTitle}</h3>
          <p>{t.quickStart.ctaCopy}</p>
        </aside>
      </div>
    </section>
  );
}
