import { Badge } from "@servexa-warranty-ai/ui/components/badge";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import { ConfigDrawer } from "@/components/config-drawer";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { Search } from "@/components/search";
import { ThemeSwitch } from "@/components/theme-switch";
import { NavigationIntergratedApps } from "@/components/navigation-intergrated-apps";
import { NavigationChats } from "@/components/navigation-chats";
import { Sparkles, RefreshCw, Download } from "lucide-react";

// AI Command Center Widgets
import { AIAlertsFeed } from "./components/ai-alerts-feed";
import { ActiveAgentsWidget } from "./components/active-agents-widget";
import { CommandCenterStats } from "./components/command-center-stats";
import { RepairBottlenecksWidget } from "./components/repair-bottlenecks-widget";
import { SLARiskWidget } from "./components/sla-risk-widget";
import { StockoutPredictionWidget } from "./components/stockout-prediction-widget";
import { TechnicianLoadWidget } from "./components/technician-load-widget";

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <NavigationChats />
          <NavigationIntergratedApps />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-ai-primary/20">
              <Sparkles className="w-5 h-5 text-ai-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Command Center</h1>
              <p className="text-sm text-muted-foreground">
                Real-time operational intelligence powered by AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-alert-success animate-pulse" />
              Live
            </Badge>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <CommandCenterStats />

        {/* Main Grid */}
        <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-3">
          {/* Left Column - AI Alerts (spans 2 rows on large screens) */}
          <AIAlertsFeed />

          {/* Middle Column */}
          <SLARiskWidget />
          <StockoutPredictionWidget />

          {/* Right Column */}
          <TechnicianLoadWidget />
          <RepairBottlenecksWidget />

          {/* Full Width - Active Agents */}
          <div className="lg:col-span-2">
            <ActiveAgentsWidget />
          </div>
        </div>
      </Main>
    </>
  );
}
