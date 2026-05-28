"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { useLaunchMode } from "@/components/mode-provider";
import { demoHookAddress, deploymentAddresses, getActiveHookAddress } from "@/lib/contracts";
import { activeChain, getExplorerAddressUrl } from "@/lib/chains";
import { shortAddress } from "@/lib/formatters";

export function DeploymentPanel() {
  const { t } = useLanguage();
  const { mode } = useLaunchMode();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rows = [
    {
      key: "activeMode",
      label: t.deployment.activeMode,
      value: mode === "demo" ? t.deployment.guidedMode : t.deployment.protocolMode,
      copyable: false,
      href: undefined
    },
    {
      key: "network",
      label: t.deployment.network,
      value: activeChain.id === 196 ? t.common.mainnet : t.common.testnet,
      copyable: false,
      href: undefined
    },
    {
      key: "activeHook",
      label: t.deployment.activeHook,
      value: getActiveHookAddress(mode),
      copyable: true,
      href: getExplorerAddressUrl(getActiveHookAddress(mode))
    },
    {
      key: "interactionHook",
      label: t.deployment.interactionHook,
      value: demoHookAddress,
      copyable: true,
      href: getExplorerAddressUrl(demoHookAddress)
    },
    {
      key: "v4Hook",
      label: t.deployment.v4Hook,
      value: deploymentAddresses.v4HookAddress,
      copyable: true,
      href: getExplorerAddressUrl(deploymentAddresses.v4HookAddress)
    },
    {
      key: "poolManager",
      label: t.deployment.poolManager,
      value: deploymentAddresses.poolManagerAddress,
      copyable: true,
      href: getExplorerAddressUrl(deploymentAddresses.poolManagerAddress)
    },
    {
      key: "poolId",
      label: t.deployment.poolId,
      value: deploymentAddresses.poolId,
      copyable: true,
      href: undefined
    },
    {
      key: "releasePath",
      label: t.deployment.releasePath,
      value: t.deployment.releaseValue,
      copyable: false,
      href: undefined
    }
  ];

  async function copyValue(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1400);
  }

  return (
    <section className="container appendix-section">
      <div className="section-topbar appendix-topbar">
        <div>
          <h2 className="section-title appendix-title">{t.deployment.title}</h2>
          <p className="appendix-copy">{t.deployment.description}</p>
        </div>
        <span className="appendix-badge">{mode === "demo" ? t.deployment.guidedBadge : t.deployment.protocolBadge}</span>
      </div>
      <div className="deployment-card appendix-card">
        <div className="info-list">
          {rows.map((row) => (
            <div className="info-row deployment-row" key={row.key}>
              <span className="label">{row.label}</span>
              <div className="deployment-actions">
                <strong className="mono">
                  {row.value.startsWith("0x") && row.value.length === 42 ? shortAddress(row.value) : row.value}
                </strong>
                {row.copyable ? (
                  <button className="mini-button" type="button" onClick={() => copyValue(row.key, row.value)}>
                    {copiedKey === row.key ? t.deployment.copied : t.deployment.copy}
                  </button>
                ) : null}
                {row.href ? (
                  <a className="mini-button mini-link" href={row.href} target="_blank" rel="noreferrer">
                    {t.deployment.view}
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
