import { ActionPanel } from "@/components/sections/action-panel";
import { DeploymentPanel } from "@/components/sections/deployment-panel";
import { Hero } from "@/components/sections/hero";
import { IdentityPanel } from "@/components/sections/identity-panel";
import { LaunchMetrics } from "@/components/sections/launch-metrics";
import { MechanismCards } from "@/components/sections/mechanism-cards";
import { QuickStart } from "@/components/sections/quick-start";

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-noise" />
      <Hero />
      <LaunchMetrics />
      <section className="grid-shell">
        <ActionPanel />
        <IdentityPanel />
      </section>
      <QuickStart />
      <MechanismCards />
      <DeploymentPanel />
    </main>
  );
}
