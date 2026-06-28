import { Button } from '@servexa-warranty-ai/ui/components/button'
import { useRepairCases } from './repair-cases-provider'
import { RefreshCw } from 'lucide-react'
import { cn } from '@servexa-warranty-ai/ui/lib/utils'
import { useState } from 'react'

interface RepairCasesPrimaryButtonsProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function RepairCasesPrimaryButtons({ onRefresh, isRefreshing }: RepairCasesPrimaryButtonsProps) {
  const { setOpen } = useRepairCases()
  const [localRefreshing, setLocalRefreshing] = useState(false)

  const handleRefresh = () => {
    if (localRefreshing || isRefreshing) return;
    setLocalRefreshing(true)
    setTimeout(() => {
      onRefresh?.()
      setLocalRefreshing(false)
    }, 500)
  }

  const spinning = isRefreshing || localRefreshing

  return (
    <div className="flex justify-end gap-2 ">
      <Button onClick={() => setOpen('add')}>New repair case</Button>
      <Button onClick={() => setOpen('export-excel')} className="text-white bg-green-500 hover:bg-green-600">Export excel</Button>
      <Button onClick={handleRefresh} size="icon" variant="outline" disabled={spinning}>
        <RefreshCw className={cn("size-4", spinning && "animate-spin")} />
      </Button>
    </div>
  )
}
