"use client";

import "@rainbow-me/rainbowkit/styles.css";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { LanguageProvider } from "@/components/language-provider";
import { LaunchModeProvider } from "@/components/mode-provider";
import { supportedChains } from "@/lib/chains";
import { useState } from "react";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo-project-id";

const config = getDefaultConfig({
  appName: "Pulse Launch",
  projectId: walletConnectProjectId,
  chains: [...supportedChains],
  ssr: true
});

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LanguageProvider>
      <LaunchModeProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: "#ff9d4d",
                accentColorForeground: "#07111f",
                borderRadius: "large"
              })}
            >
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </LaunchModeProvider>
    </LanguageProvider>
  );
}
