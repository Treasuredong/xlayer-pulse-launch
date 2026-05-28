"use client";

import { useMemo, useState } from "react";
import { encodeAbiParameters, formatEther, maxUint256, parseEther } from "viem";
import { useLanguage } from "@/components/language-provider";
import { useLaunchMode } from "@/components/mode-provider";
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import {
  deploymentAddresses,
  erc20Abi,
  getActiveHookAddress,
  getV4PoolKey,
  poolModifyLiquidityTestAbi,
  poolSwapTestAbi,
  pulseLaunchHookAbi,
  v4PoolConfig
} from "@/lib/contracts";
import { shortAddress } from "@/lib/formatters";

function formatError(error: unknown) {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  if ("shortMessage" in error && typeof error.shortMessage === "string") {
    return error.shortMessage;
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Transaction rejected or failed.";
}

function formatTokenAmount(value?: bigint) {
  if (value === undefined) {
    return "0";
  }

  if (value > 10n ** 30n) {
    return "MAX";
  }

  const normalized = Number(formatEther(value));
  if (!Number.isFinite(normalized)) {
    return formatEther(value);
  }

  return normalized.toLocaleString(undefined, {
    maximumFractionDigits: 4
  });
}

export function ActionPanel() {
  const { t } = useLanguage();
  const { mode } = useLaunchMode();
  const { address, isConnected } = useAccount();
  const [buyAmount, setBuyAmount] = useState("250");
  const [lpAmount, setLpAmount] = useState("500");
  const [lastAction, setLastAction] = useState<string | null>(null);
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash });
  const hookAddress = getActiveHookAddress(mode);
  const hookReady = hookAddress !== "0x0000000000000000000000000000000000000000";
  const canInteract = isConnected && hookReady && mode === "demo";

  const poolKey = useMemo(() => getV4PoolKey(), []);
  const quoteTokenAddress = deploymentAddresses.quoteTokenAddress;
  const pulseTokenAddress = deploymentAddresses.pulseTokenAddress;
  const swapRouterAddress = deploymentAddresses.swapRouterAddress;
  const modifyLiquidityRouterAddress = deploymentAddresses.modifyLiquidityRouterAddress;
  const protocolReady =
    deploymentAddresses.v4HookAddress !== "0x0000000000000000000000000000000000000000" &&
    quoteTokenAddress !== "0x0000000000000000000000000000000000000000" &&
    pulseTokenAddress !== "0x0000000000000000000000000000000000000000" &&
    swapRouterAddress !== "0x0000000000000000000000000000000000000000" &&
    modifyLiquidityRouterAddress !== "0x0000000000000000000000000000000000000000";

  const tokenReads = useReadContracts({
    allowFailure: false,
    contracts:
      address && protocolReady
        ? [
            {
              address: quoteTokenAddress,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [address]
            },
            {
              address: pulseTokenAddress,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [address]
            },
            {
              address: quoteTokenAddress,
              abi: erc20Abi,
              functionName: "allowance",
              args: [address, swapRouterAddress]
            },
            {
              address: quoteTokenAddress,
              abi: erc20Abi,
              functionName: "allowance",
              args: [address, modifyLiquidityRouterAddress]
            },
            {
              address: pulseTokenAddress,
              abi: erc20Abi,
              functionName: "allowance",
              args: [address, modifyLiquidityRouterAddress]
            }
          ]
        : [],
    query: {
      enabled: Boolean(address) && protocolReady,
      refetchInterval: 5000
    }
  });

  const quoteBalance = (tokenReads.data?.[0] as bigint | undefined) ?? 0n;
  const pulseBalance = (tokenReads.data?.[1] as bigint | undefined) ?? 0n;
  const quoteAllowance = (tokenReads.data?.[2] as bigint | undefined) ?? 0n;
  const lpQuoteAllowance = (tokenReads.data?.[3] as bigint | undefined) ?? 0n;
  const lpPulseAllowance = (tokenReads.data?.[4] as bigint | undefined) ?? 0n;

  const parsedBuyAmount = mode === "v4" ? safeParseEther(buyAmount) : 0n;
  const parsedLpAmount = mode === "v4" ? safeParseEther(lpAmount) : 0n;
  const hasQuoteApproval = parsedBuyAmount > 0n ? quoteAllowance >= parsedBuyAmount : quoteAllowance > 0n;
  const hasQuoteBalance = parsedBuyAmount > 0n ? quoteBalance >= parsedBuyAmount : quoteBalance > 0n;
  const hasLpQuoteApproval = parsedLpAmount > 0n ? lpQuoteAllowance >= parsedLpAmount : lpQuoteAllowance > 0n;
  const hasLpPulseApproval = parsedLpAmount > 0n ? lpPulseAllowance >= parsedLpAmount : lpPulseAllowance > 0n;
  const hasLpBalances = parsedLpAmount > 0n ? quoteBalance >= parsedLpAmount && pulseBalance >= parsedLpAmount : quoteBalance > 0n && pulseBalance > 0n;

  function triggerBuy() {
    setLastAction(t.action.triggerBuy);
    writeContract({
      address: hookAddress,
      abi: pulseLaunchHookAbi,
      functionName: "simulateBuy",
      args: [parseEther(buyAmount || "0")]
    });
  }

  function triggerLp() {
    setLastAction(t.action.joinLp);
    writeContract({
      address: hookAddress,
      abi: pulseLaunchHookAbi,
      functionName: "simulateAddLiquidity"
    });
  }

  function approveQuote() {
    setLastAction(t.action.approveQuote);
    writeContract({
      address: quoteTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [swapRouterAddress, maxUint256]
    });
  }

  function approveQuoteLp() {
    setLastAction(t.action.approveQuoteLp);
    writeContract({
      address: quoteTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [modifyLiquidityRouterAddress, maxUint256]
    });
  }

  function approvePulseLp() {
    setLastAction(t.action.approvePulseLp);
    writeContract({
      address: pulseTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [modifyLiquidityRouterAddress, maxUint256]
    });
  }

  function triggerLiveBuy() {
    if (!address) {
      return;
    }

    const zeroForOne = quoteTokenAddress.toLowerCase() === poolKey.currency0.toLowerCase();

    setLastAction(t.action.triggerLiveBuy);
    writeContract({
      address: swapRouterAddress,
      abi: poolSwapTestAbi,
      functionName: "swap",
      args: [
        poolKey,
        {
          zeroForOne,
          amountSpecified: -parsedBuyAmount,
          sqrtPriceLimitX96: zeroForOne ? v4PoolConfig.minPriceLimit : v4PoolConfig.maxPriceLimit
        },
        {
          takeClaims: false,
          settleUsingBurn: false
        },
        encodeAbiParameters([{ type: "address" }], [address])
      ]
    });
  }

  function triggerLiveLp() {
    if (!address) {
      return;
    }

    setLastAction(t.action.triggerLiveLp);
    writeContract({
      address: modifyLiquidityRouterAddress,
      abi: poolModifyLiquidityTestAbi,
      functionName: "modifyLiquidity",
      args: [
        poolKey,
        {
          tickLower: v4PoolConfig.defaultTickLower,
          tickUpper: v4PoolConfig.defaultTickUpper,
          liquidityDelta: parsedLpAmount,
          salt: "0x0000000000000000000000000000000000000000000000000000000000000000"
        },
        encodeAbiParameters([{ type: "address" }], [address])
      ]
    });
  }

  const statusMessage = !hookReady
    ? t.action.statusNoHook
    : mode === "v4"
      ? !isConnected
        ? t.action.statusConnect
        : !protocolReady
          ? t.action.statusProtocolReadOnly
          : isPending
            ? t.action.statusPending
            : receipt.isSuccess
              ? t.action.statusConfirmed
              : t.action.statusProtocolLpReady
      : isPending
        ? t.action.statusPending
        : receipt.isSuccess
          ? t.action.statusConfirmed
          : isConnected
            ? t.action.statusReady
            : t.action.statusConnect;

  const protocolFeedback = !hasQuoteBalance
    ? t.action.needsQuoteBalance
    : !hasQuoteApproval
      ? t.action.needsQuoteApproval
      : !hasLpBalances
        ? t.action.needsLpBalances
        : !hasLpQuoteApproval
          ? t.action.needsLpQuoteApproval
          : !hasLpPulseApproval
            ? t.action.needsLpPulseApproval
            : t.action.readyToLp;

  const feedbackMessage =
    formatError(error) ??
    hash ??
    (mode === "v4" ? protocolFeedback : `${t.action.lpPreset}: ${lpAmount} tokens`);
  const steps = mode === "v4" ? t.action.steps.protocol : t.action.steps.guided;

  return (
    <section className="action-card">
      <div className="section-topbar">
        <h2>{t.action.title}</h2>
        <span className="helper mono">{shortAddress(address) || t.common.notConnected}</span>
      </div>
      <p>{t.action.description}</p>
      <div className="action-stack">
        <div className="action-rail">
          <div className="action-rail-header">
            <div>
              <strong>{t.action.railTitle}</strong>
              <p>{t.action.railCopy}</p>
            </div>
            <div className="inline-note action-mode-note">
              <strong>{mode === "demo" ? t.action.guidedModeLabel : t.action.protocolModeLabel}</strong>
              <span>{mode === "demo" ? t.action.guidedModeCopy : t.action.protocolModeCopy}</span>
            </div>
          </div>
          <div className="action-step-grid">
            {steps.map((step) => (
              <article className="action-step-card" key={step.title}>
                <span className="quickstart-index">{step.badge}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>

        {mode === "demo" ? (
          <>
            <div className="action-flow-card">
              <div className="field-grid">
                <label className="field">
                  <span className="label">{t.action.buyAmount}</span>
                  <input value={buyAmount} onChange={(event) => setBuyAmount(event.target.value)} />
                </label>
                <label className="field">
                  <span className="label">{t.action.lpAmount}</span>
                  <input value={lpAmount} onChange={(event) => setLpAmount(event.target.value)} />
                </label>
              </div>
              <div className="button-row">
                <button className="button-primary" type="button" disabled={!canInteract || isPending} onClick={triggerBuy}>
                  {t.action.triggerBuy}
                </button>
                <button className="button-secondary" type="button" disabled={!canInteract || isPending} onClick={triggerLp}>
                  {t.action.joinLp}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="inline-note protocol-guide action-flow-card">
              <strong>{t.action.testAssetGuideTitle}</strong>
              <span>{t.action.testAssetGuideCopy}</span>
              <span>{t.action.assetReminder}</span>
            </div>
            <div className="protocol-card action-flow-card">
              <div className="section-topbar compact">
                <h3>{t.action.protocolCardTitle}</h3>
                <span className="helper mono">{shortAddress(swapRouterAddress)}</span>
              </div>
              <p>{t.action.protocolCardCopy}</p>
              <div className="field-grid protocol-grid">
                <label className="field">
                  <span className="label">{t.action.buyAmount}</span>
                  <input value={buyAmount} onChange={(event) => setBuyAmount(event.target.value)} />
                  <small className="helper">{t.action.buyAmountHint}</small>
                </label>
                <div className="info-list protocol-info-list">
                  <div className="info-row">
                    <span className="label">{t.action.quoteBalance}</span>
                    <strong>{formatTokenAmount(quoteBalance)}</strong>
                  </div>
                  <div className="info-row">
                    <span className="label">{t.action.targetBalance}</span>
                    <strong>{formatTokenAmount(pulseBalance)}</strong>
                  </div>
                  <div className="info-row">
                    <span className="label">{t.action.swapAllowance}</span>
                    <strong>{formatTokenAmount(quoteAllowance)}</strong>
                  </div>
                  <div className="info-row">
                    <span className="label">{t.action.swapRouter}</span>
                    <strong className="mono">{shortAddress(swapRouterAddress)}</strong>
                  </div>
                </div>
              </div>
              <div className="button-row">
                <button
                  className="button-secondary"
                  type="button"
                  disabled={!isConnected || !protocolReady || isPending}
                  onClick={approveQuote}
                >
                  {t.action.approveQuote}
                </button>
                <button
                  className="button-primary"
                  type="button"
                  disabled={!isConnected || !protocolReady || !hasQuoteApproval || !hasQuoteBalance || parsedBuyAmount <= 0n || isPending}
                  onClick={triggerLiveBuy}
                >
                  {t.action.triggerLiveBuy}
                </button>
              </div>
            </div>

            <div className="protocol-card action-flow-card">
              <div className="section-topbar compact">
                <h3>{t.action.protocolLpTitle}</h3>
                <span className="helper mono">{shortAddress(modifyLiquidityRouterAddress)}</span>
              </div>
              <p>{t.action.protocolLpCopy}</p>
              <div className="field-grid protocol-grid">
                <label className="field">
                  <span className="label">{t.action.lpLiquidity}</span>
                  <input value={lpAmount} onChange={(event) => setLpAmount(event.target.value)} />
                  <small className="helper">
                    {t.action.lpRange}: {t.action.lpRangeValue}
                  </small>
                </label>
                <div className="info-list protocol-info-list">
                  <div className="info-row">
                    <span className="label">{t.action.lpQuoteAllowance}</span>
                    <strong>{formatTokenAmount(lpQuoteAllowance)}</strong>
                  </div>
                  <div className="info-row">
                    <span className="label">{t.action.lpPulseAllowance}</span>
                    <strong>{formatTokenAmount(lpPulseAllowance)}</strong>
                  </div>
                  <div className="info-row">
                    <span className="label">{t.action.lpRouter}</span>
                    <strong className="mono">{shortAddress(modifyLiquidityRouterAddress)}</strong>
                  </div>
                  <div className="info-row">
                    <span className="label">{t.action.lpRange}</span>
                    <strong>{t.action.lpRangeValue}</strong>
                  </div>
                </div>
              </div>
              <div className="button-row">
                <button
                  className="button-secondary"
                  type="button"
                  disabled={!isConnected || !protocolReady || isPending}
                  onClick={approveQuoteLp}
                >
                  {t.action.approveQuoteLp}
                </button>
                <button
                  className="button-secondary"
                  type="button"
                  disabled={!isConnected || !protocolReady || isPending}
                  onClick={approvePulseLp}
                >
                  {t.action.approvePulseLp}
                </button>
                <button
                  className="button-primary"
                  type="button"
                  disabled={
                    !isConnected ||
                    !protocolReady ||
                    !hasLpBalances ||
                    !hasLpQuoteApproval ||
                    !hasLpPulseApproval ||
                    parsedLpAmount <= 0n ||
                    isPending
                  }
                  onClick={triggerLiveLp}
                >
                  {t.action.triggerLiveLp}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="action-summary-grid">
          <div className="inline-note action-summary-card">
            <span className="label">{t.action.flow}</span>
            <strong>{mode === "v4" ? t.action.protocolFlow : t.action.flowValue}</strong>
          </div>
          <div className="inline-note action-summary-card">
            <span className="label">{t.action.status}</span>
            <strong>{statusMessage}</strong>
          </div>
          <div className="inline-note action-summary-card">
            <span className="label">{t.action.feedback}</span>
            <strong>{lastAction ? `${lastAction} · ${feedbackMessage}` : feedbackMessage}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function safeParseEther(value: string) {
  try {
    return parseEther(value || "0");
  } catch {
    return 0n;
  }
}
