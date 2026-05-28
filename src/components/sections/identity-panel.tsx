"use client";

import { useLanguage } from "@/components/language-provider";
import { useAccount } from "wagmi";
import { usePulseUserProfile } from "@/hooks/use-pulse-launch";
import { formatRole, shortAddress } from "@/lib/formatters";

export function IdentityPanel() {
  const { locale, t } = useLanguage();
  const { address } = useAccount();
  const profile = usePulseUserProfile();

  const role = profile.data
    ? formatRole(Number(profile.data[0]), Boolean(profile.data[3]), Boolean(profile.data[4]), t)
    : t.roles.observer;
  const points = profile.data ? Number(profile.data[1]) : 0;
  const lastTradeAt = profile.data ? Number(profile.data[2]) : 0;

  return (
    <section className="identity-card">
      <div className="section-topbar">
        <h2>{t.identity.title}</h2>
        <span className="helper mono">{shortAddress(address) || t.common.notConnected}</span>
      </div>
      <p>{t.identity.description}</p>
      <div className="identity-stack">
        <div className="identity-highlight">
          <small className="helper">{t.identity.currentRole}</small>
          <h3>{role}</h3>
          <p>{t.identity.roleCopy}</p>
        </div>
        <div className="identity-list">
          <div className="identity-row">
            <span className="label">{t.identity.points}</span>
            <strong>{points}</strong>
          </div>
          <div className="identity-row">
            <span className="label">{t.identity.lastTrade}</span>
            <strong>
              {lastTradeAt > 0 ? new Date(lastTradeAt * 1000).toLocaleString(locale === "zh" ? "zh-CN" : "en-US") : t.common.noTradeYet}
            </strong>
          </div>
          <div className="identity-row">
            <span className="label">{t.identity.walletState}</span>
            <strong>{address ? t.identity.walletReady : t.identity.walletWaiting}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
