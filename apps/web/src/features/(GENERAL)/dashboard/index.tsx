import { AIInsightCard } from '@/components/ai-insight-card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
// import { NavigationChats } from '@/components/navigation-chats'
// import { NavigationIntergratedApps } from '@/components/navigation-intergrated-apps'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@servexa-warranty-ai/ui/components/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card'
import { AlertTriangle, Bot, Package, ShieldAlert, Timer } from 'lucide-react'
import { useTranslation } from "react-i18next";

const commandCenterKpis = [
  { label: 'Critical Alerts', value: '8', delta: '+2 in the last hour', icon: AlertTriangle },
  { label: 'SLA Breach Risk', value: '14', delta: '6 are high confidence', icon: Timer },
  { label: 'Stockout Predictions', value: '5', delta: '2 require action today', icon: Package },
  { label: 'Active AI Agents', value: '4', delta: 'All systems healthy', icon: Bot },
]

export function Dashboard() {
    const { t } = useTranslation();
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          {/* <NavigationChats /> */}
          {/* <NavigationIntergratedApps /> */}
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("AI Command Center")}</h1>
            <p className="text-sm text-muted-foreground">{t("Operational intelligence with evidence-backed recommendations.")}</p>
          </div>
          <Badge variant="outline" className="h-7">
            {t("Live Operations")}</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {commandCenterKpis.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{item.label}</CardDescription>
                  <CardTitle className="text-2xl">{item.value}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{item.delta}</p>
                  <Icon className="h-4 w-4 text-ai-primary" aria-hidden="true" />
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <AIInsightCard
            title={t("SLA Escalation Risk")}
            insight="Case RC-4291 is likely to miss SLA within 4 hours due to parts delivery delay and technician backlog."
            confidence={0.91}
            severity="critical"
            sources={[
              { id: 'case-4291', type: 'repair_case', title: 'Repair Case RC-4291', snippet: 'Waiting for compressor relay replacement' },
              { id: 'inv-12', type: 'inventory', title: 'Inventory Forecast', snippet: 'Relay ETA 6 hours; stockout risk 78%' },
            ]}
            actions={[
              { id: 'escalate-case', label: 'Create Escalation', action: 'escalate', variant: 'destructive' },
              { id: 'reassign-case', label: 'Reassign Technician', action: 'reassign', variant: 'outline' },
            ]}
          />

          <AIInsightCard
            title={t("Stockout Prediction")}
            insight="Compressor X12 stock is projected to deplete in 5 days based on current failure trends in 3 regions."
            confidence={0.86}
            severity="warning"
            sources={[
              { id: 'part-x12', type: 'inventory', title: 'Part Forecast Model', snippet: 'Demand up 22% WoW in North region' },
              { id: 'bulletin-11', type: 'knowledge_base', title: 'Vendor Bulletin SB-11', snippet: 'Potential delay in next shipment window' },
            ]}
            actions={[
              { id: 'order-part', label: 'Order Parts', action: 'order_parts' },
              { id: 'alt-vendor', label: 'Switch Vendor', action: 'switch_vendor', variant: 'secondary' },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="h-4 w-4 text-ai-primary" aria-hidden="true" />
                {t("Active Agent Activity")}</CardTitle>
              <CardDescription>{t("Latest autonomous actions taken by AI agents.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border border-border/60 p-3">
                {t("Supply Chain Agent flagged delayed shipments for vendor V-22 and recommended rerouting.")}</div>
              <div className="rounded-md border border-border/60 p-3">
                {t("Warranty Agent detected a spike in repeated claims for model WM-230.")}</div>
              <div className="rounded-md border border-border/60 p-3">
                {t("Diagnostic Agent suggested updated troubleshooting workflow for E21 error patterns.")}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("Technician Workload Overview")}</CardTitle>
              <CardDescription>{t("Current queue pressure by operating zone.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-md bg-muted/30 p-2">
                <span>{t("North Zone")}</span>
                <Badge variant="secondary">{t("87% capacity")}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/30 p-2">
                <span>{t("Central Zone")}</span>
                <Badge variant="outline">{t("64% capacity")}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/30 p-2">
                <span>{t("South Zone")}</span>
                <Badge variant="outline">{t("58% capacity")}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
