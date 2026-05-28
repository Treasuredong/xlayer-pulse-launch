"use client";

import { useLanguage } from "@/components/language-provider";

export function MechanismCards() {
  const { t } = useLanguage();

  return (
    <section className="container">
      <div className="section-topbar">
        <h2 className="section-title">{t.story.title}</h2>
        <span className="helper">{t.story.subtitle}</span>
      </div>
      <div className="story-grid">
        {t.story.cards.map((card) => (
          <article className="story-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
