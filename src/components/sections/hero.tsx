"use client";

import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { useLaunchMode } from "@/components/mode-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { WalletButton } from "@/components/wallet-button";
import { usePulseLaunchSnapshot } from "@/hooks/use-pulse-launch";
import { formatPhase } from "@/lib/formatters";

export function Hero() {
  const { t } = useLanguage();
  const { mode } = useLaunchMode();
  const snapshot = usePulseLaunchSnapshot();
  const phase = snapshot.data ? formatPhase(Number(snapshot.data[0]), t) : t.phases.shield;
  const uniqueBuyers = snapshot.data ? Number(snapshot.data[1]) : 0;
  const earlyLpCount = snapshot.data ? Number(snapshot.data[2]) : 0;

  return (
    <section className="container hero">
      <div className="hero-card glass-panel">
        <div className="hero-topbar">
          <span className="eyebrow">{t.topbar.badge}</span>
          <div className="topbar-actions">
            <ModeToggle />
            <LanguageToggle />
            <WalletButton />
          </div>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>{t.common.appName}</h1>
            <p className="hero-kicker">{t.hero.kicker}</p>
            <p>{t.hero.description}</p>
            <div className="hero-badges">
              <span className="status-badge">
                <span className="status-dot" />
                {t.hero.livePhase}: {phase}
              </span>
              <span className="metric-chip">
                {t.hero.uniqueBuyers}: {uniqueBuyers}
              </span>
              <span className="metric-chip">
                {t.hero.networkGoal}: {t.common.mainnet}
              </span>
            </div>
            <div className="hero-storyboard">
              {t.hero.rails.map((rail) => (
                <article className="hero-story-card" key={rail.title}>
                  <strong>{rail.title}</strong>
                  <p>{rail.copy}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="hero-side">
            <div className="hero-brief glass-panel">
              <div className="hero-brief-row">
                <span className="label">{t.hero.marketLabel}</span>
                <strong>{phase}</strong>
              </div>
              <p>{t.hero.marketCopy}</p>
              <div className="hero-brief-divider" />
              <div className="hero-brief-row">
                <span className="label">{t.hero.nextActionLabel}</span>
                <strong>{mode === "demo" ? t.deployment.guidedMode : t.deployment.protocolMode}</strong>
              </div>
              <p>{mode === "demo" ? t.hero.nextActionGuided : t.hero.nextActionProtocol}</p>
              <div className="hero-brief-stats">
                <div>
                  <small className="helper">{t.hero.uniqueBuyers}</small>
                  <strong>{uniqueBuyers}</strong>
                </div>
                <div>
                  <small className="helper">{t.metrics.guardianLps.title}</small>
                  <strong>{earlyLpCount}</strong>
                </div>
              </div>
            </div>
            <div className="phase-radar glass-panel">
              <div className="phase-center">
                <div>
                  <small className="helper">{t.common.currentPhase}</small>
                  <strong>{phase}</strong>
                </div>
              </div>
              <div className="phase-node phase-node-1">
                <small>{t.hero.shieldTitle}</small>
                <strong>{t.hero.shieldHeadline}</strong>
                <span className="helper">{t.hero.shieldCopy}</span>
              </div>
              <div className="phase-node phase-node-2">
                <small>{t.hero.discoveryTitle}</small>
                <strong>{t.hero.discoveryHeadline}</strong>
                <span className="helper">{t.hero.discoveryCopy}</span>
              </div>
              <div className="phase-node phase-node-3">
                <small>{t.hero.openTitle}</small>
                <strong>{t.hero.openHeadline}</strong>
                <span className="helper">{t.hero.openCopy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
