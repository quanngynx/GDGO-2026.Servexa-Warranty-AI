import { useRepairCaseDetailQuery } from '../hooks/use-repair-case-detail-query'
import { Card, CardContent, CardHeader, CardTitle } from '@servexa-warranty-ai/ui/components/card'
import { Badge } from '@servexa-warranty-ai/ui/components/badge'
import { Separator } from '@servexa-warranty-ai/ui/components/separator'
import { AlertCircle, RefreshCw, Printer, ChevronDown, User2, Package, Tickets, CircleDollarSign, MessagesSquare, UploadCloud } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@servexa-warranty-ai/ui/components/alert'
import { Button } from '@servexa-warranty-ai/ui/components/button'
import { Dialog, DialogContent, DialogTrigger } from '@servexa-warranty-ai/ui/components/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@servexa-warranty-ai/ui/components/tooltip'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@servexa-warranty-ai/ui/components/tabs'
import { useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { SelectTechnician } from '@/components/selects/select-technician'
import { RepairCaseImages } from './repair-case-images'
import { RepairCaseHistories } from './repair-case-histories'
import { useTranslation } from "react-i18next";

export function RepairCaseDetail({ id }: { id: string }) {
    const { t } = useTranslation();
  const { data, isLoading, isError, error } = useRepairCaseDetailQuery(id)

  const appNavigate = useNavigate()

  if (isLoading) {
    return <div aria-live="polite" className="p-8 text-center text-muted-foreground">{t("Loading…")}</div>
  }

  if (isError) {
    return (
      <div className="p-8" aria-live="polite">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>{t("Error")}</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load repair case details.'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const repairCase = data?.metadata

  if (!repairCase) {
    return <div className="p-8 text-center text-muted-foreground">{t("No data found.")}</div>
  }

  const formatCost = (val?: number | string | null) => Number(val || 0).toFixed(2);

  return (
    <article>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <Button
            size='icon'
            variant='outline'
            className='md:size-7'
            onClick={() => appNavigate({ to: '/chats' })}
          >
            <MessagesSquare className='size-[1.2rem]' />
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <div className="flex flex-col gap-2 bg-primary-100 px-4">
        <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t("Repair Ticket #")}{repairCase.caseNumber}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 capitalize font-medium border-transparent">
                    {repairCase.warrantyForm?.replace(/_/g, ' ') || 'Unknown'}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{t("Warranty Form")}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 capitalize font-medium border-transparent">
                    {repairCase.status?.replace(/_/g, ' ') || 'Unknown'}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>{t("Status")}</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full">
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="font-medium">
              <Printer className="mr-2 h-4 w-4" />
              {t("Print")}</Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="font-medium">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {t("Upload images")}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] min-h-[50vh] overflow-y-auto">
                <RepairCaseImages repairCaseId={id} hideList />
              </DialogContent>
            </Dialog>

            <Button className="font-medium bg-[#004299] hover:bg-[#00337a] text-white">
              {t("Status Change")}<ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </header>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto space-x-6 overflow-x-auto">
            <TabsTrigger value="general" className="text-muted-foreground data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2.5 font-medium">{t("General")}</TabsTrigger>
            <TabsTrigger value="images" className="text-muted-foreground data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2.5 font-medium">{t("Images")}</TabsTrigger>
            <TabsTrigger value="history" className="text-muted-foreground data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2.5 font-medium">{t("History")}</TabsTrigger>
            <TabsTrigger value="components" className="text-muted-foreground data-[state=active]:text-primary rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2.5 font-medium">{t("Components")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="pt-2">
            <div className="grid gap-4 md:grid-cols-2">
              <section>
                <Card className=''>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User2 className='h-4 w-4' />
                      <span className="text-xs font-bold">{t("Customer Information")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className='font-medium'>
                      <span className="">{t("Name:")}</span> {repairCase.customer?.fullName || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">{t("Phone:")}</span> {repairCase.customer?.phone1 || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">{t("Email:")}</span> {repairCase.customer?.email || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">{t("Address:")}</span> {repairCase.customer?.address || 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className='h-4 w-4' />
                      <span className="text-xs font-bold">{t("Product Details")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">{t("Model:")}</span> {repairCase.model?.name || 'N/A'} ({repairCase.model?.modelCode || 'N/A'})
                    </div>
                    <div>
                      <span className="font-medium">{t("Serial Number:")}</span> {repairCase.serialNumber || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">{t("Order ID:")}</span> <span className="capitalize">{t("ORD-1910289412391283")}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t("Warranty Type:")}</span> <span className="capitalize">{t("Customer brings to ASC")}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t("Service Type:")}</span> <span className="capitalize">{repairCase.warrantyServiceType?.replace(/_/g, ' ') || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t("Where to buy:")}</span> <span className="capitalize">{t("Shopee - online")}</span>
                    </div>

                  </CardContent>
                </Card>
              </section>

              <section className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tickets className='h-4 w-4' />
                      <span className="text-xs font-bold">{t("Repair Information - #")}{repairCase.caseNumber}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">{t("ASC Center:")}</span> {repairCase.ascCenter?.centerName || 'N/A'}
                    </div>
                    <div className="grid grid-cols-3 grid-rows-2 gap-4 my-4">
                      <div className="flex items-center gap-4">
                        <span className="font-medium whitespace-nowrap">{t("Assigned Technician:")}</span>
                        <SelectTechnician
                          value={repairCase.assignedTechnicianId}
                          onValueChange={(val) => {
                            console.log('Selected technician ID:', val)
                          }}
                          className="w-full max-w-[200px]"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium whitespace-nowrap">{t("Error phenomena:")}</span>
                        <SelectTechnician
                          value={repairCase.assignedTechnicianId}
                          onValueChange={(val) => {
                            console.log('Selected technician ID:', val)
                          }}
                          className="w-full max-w-[200px]"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium whitespace-nowrap">{t("Reason/Cause:")}</span>
                        <SelectTechnician
                          value={repairCase.assignedTechnicianId}
                          onValueChange={(val) => {
                            console.log('Selected technician ID:', val)
                          }}
                          className="w-full max-w-[200px]"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium whitespace-nowrap">{t("Error Source:")}</span>
                        <SelectTechnician
                          value={repairCase.assignedTechnicianId}
                          onValueChange={(val) => {
                            console.log('Selected technician ID:', val)
                          }}
                          className="w-full max-w-[200px]"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium whitespace-nowrap">{t("Repair Level:")}</span>
                        <SelectTechnician
                          value={repairCase.assignedTechnicianId}
                          onValueChange={(val) => {
                            console.log('Selected technician ID:', val)
                          }}
                          className="w-full max-w-[200px]"
                        />
                      </div>
                    </div>
                    {repairCase.diagnosis && (
                      <div className="mt-4">
                        <span className="font-medium block mb-1">{t("Diagnosis:")}</span>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {repairCase.diagnosis}
                        </p>
                      </div>
                    )}
                    {repairCase.repairSolution && (
                      <div className="mt-4">
                        <span className="font-medium block mb-1">{t("Repair Solution:")}</span>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {repairCase.repairSolution}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>

              <section className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CircleDollarSign className='h-4 w-4' />
                      <span className="text-xs font-medium">{t("Costs & Fees")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t("Service Fee:")}</span>
                      <span className="font-medium tabular-nums">${formatCost(repairCase.serviceFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("Labor Cost:")}</span>
                      <span className="font-medium tabular-nums">${formatCost(repairCase.laborCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("Parts Cost:")}</span>
                      <span className="font-medium tabular-nums">${formatCost(repairCase.partsCost)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>{t("Shipping/Distance Fee:")}</span>
                      <span className="tabular-nums">${formatCost(Number(repairCase.shippingCost || 0) + Number(repairCase.distanceFee || 0))}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t("Total Cost:")}</span>
                      <span className="tabular-nums">${formatCost(repairCase.totalCost)}</span>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </TabsContent>
          <TabsContent value="images">
            <RepairCaseImages repairCaseId={id} hideUpload />
          </TabsContent>
          <TabsContent value="history">
            <RepairCaseHistories repairCaseId={id} />
          </TabsContent>
          <TabsContent value="components">
            <div className="p-8 text-center text-muted-foreground">{t("Components content coming soon.")}</div>
          </TabsContent>
        </Tabs>
      </div>
    </article>
  )
}
