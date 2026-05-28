"use client";

import { useLaunchMode } from "@/components/mode-provider";
import { useAccount, useReadContract } from "wagmi";
import { getActiveHookAddress, pulseLaunchHookAbi } from "@/lib/contracts";

export function usePulseLaunchSnapshot() {
  const { mode } = useLaunchMode();
  const hookAddress = getActiveHookAddress(mode);
  const hookReady = hookAddress !== "0x0000000000000000000000000000000000000000";

  return useReadContract({
    address: hookAddress,
    abi: pulseLaunchHookAbi,
    functionName: "getLaunchSnapshot",
    query: {
      enabled: hookReady,
      refetchInterval: 5000
    }
  });
}

export function usePulseUserProfile() {
  const { mode } = useLaunchMode();
  const { address } = useAccount();
  const hookAddress = getActiveHookAddress(mode);
  const hookReady = hookAddress !== "0x0000000000000000000000000000000000000000";

  return useReadContract({
    address: hookAddress,
    abi: pulseLaunchHookAbi,
    functionName: "getUserProfile",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: Boolean(address) && hookReady,
      refetchInterval: 5000
    }
  });
}
