"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type LaunchMode = "demo" | "v4";

type LaunchModeContextValue = {
  mode: LaunchMode;
  setMode: (mode: LaunchMode) => void;
  toggleMode: () => void;
};

const LaunchModeContext = createContext<LaunchModeContextValue | null>(null);
const STORAGE_KEY = "pulse-launch-mode";

export function LaunchModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<LaunchMode>("demo");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "demo" || saved === "v4") {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo<LaunchModeContextValue>(() => {
    return {
      mode,
      setMode,
      toggleMode: () => setMode((current) => (current === "demo" ? "v4" : "demo"))
    };
  }, [mode]);

  return <LaunchModeContext.Provider value={value}>{children}</LaunchModeContext.Provider>;
}

export function useLaunchMode() {
  const context = useContext(LaunchModeContext);
  if (!context) {
    throw new Error("useLaunchMode must be used within LaunchModeProvider");
  }
  return context;
}
