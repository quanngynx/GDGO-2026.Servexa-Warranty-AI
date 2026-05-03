import { Button } from '@servexa-warranty-ai/ui/components/button'
import { useRepairCases } from './repair-cases-provider'
import { RefreshCw } from 'lucide-react'
export function RepairCasesPrimaryButtons() {
  const { setOpen } = useRepairCases()
  return (
    <div className="flex justify-end gap-2 ">
      <Button onClick={() => setOpen('add')}>New repair case</Button>
      <Button onClick={() => setOpen('export-excel')} className="text-white bg-green-500 hover:bg-green-600">Export excel</Button>
      <Button onClick={() => { }} size="icon" variant="outline" >
        <RefreshCw className="size-4 animate-spin" />
      </Button>
    </div>
  )
}
