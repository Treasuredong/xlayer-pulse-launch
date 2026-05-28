"use client";

import { useLanguage } from "@/components/language-provider";
import { useLaunchMode } from "@/components/mode-provider";

export function ModeToggle() {
  const { t } = useLanguage();
  const { mode, setMode } = useLaunchMode();

  return (
    <div className="mode-toggle" role="tablist" aria-label="Launch mode">
      <button
        className={mode === "demo" ? "mode-toggle-button active" : "mode-toggle-button"}
        type="button"
        onClick={() => setMode("demo")}
      >
        {t.deployment.guidedMode}
      </button>
      <button
        className={mode === "v4" ? "mode-toggle-button active" : "mode-toggle-button"}
        type="button"
        onClick={() => setMode("v4")}
      >
        {t.deployment.protocolMode}
      </button>
    </div>
  );
}
