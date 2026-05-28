"use client";

import { useLanguage } from "@/components/language-provider";
import { usePulseLaunchSnapshot } from "@/hooks/use-pulse-launch";

function percent(current: number, total: number) {
  if (total <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((current / total) * 100));
}

export function LaunchMetrics() {
  const { t } = useLanguage();
  const snapshot = usePulseLaunchSnapshot();
  const uniqueBuyers = snapshot.data ? Number(snapshot.data[1]) : 0;
  const earlyLpCount = snapshot.data ? Number(snapshot.data[2]) : 0;
  const buyCap = snapshot.data ? Number(snapshot.data[3]) : 0;
  const cooldown = snapshot.data ? Number(snapshot.data[4]) : 0;
  const penalty = snapshot.data ? Number(snapshot.data[5]) : 0;

  const cards = [
    {
      title: t.metrics.communityUnlock.title,
      value: `${uniqueBuyers}/12`,
      copy: t.metrics.communityUnlock.copy,
      bar: percent(uniqueBuyers, 12)
    },
    {
      title: t.metrics.guardianLps.title,
      value: `${earlyLpCount}/5`,
      copy: t.metrics.guardianLps.copy,
      bar: percent(earlyLpCount, 5)
    },
    {
      title: t.metrics.buyCap.title,
      value: `${buyCap || 2500} tokens`,
      copy: t.metrics.buyCap.copy,
      bar: 62
    },
    {
      title: t.metrics.sellPenalty.title,
      value: `${(penalty || 800) / 100}%`,
      copy: t.metrics.sellPenalty.copy,
      bar: 80
    }
  ];

  return (
    <section className="container">
      <div className="section-topbar">
        <h2 className="section-title">{t.metrics.title}</h2>
        <span className="phase-chip">
          {t.metrics.cooldownWindow}: {cooldown || 60}s
        </span>
      </div>
      <div className="metrics-grid">
        {cards.map((card) => (
          <article key={card.title} className="metric-card glass-panel">
            <h3>{card.title}</h3>
            <strong>{card.value}</strong>
            <p>{card.copy}</p>
            <div className="metric-bar">
              <span style={{ width: `${card.bar}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
