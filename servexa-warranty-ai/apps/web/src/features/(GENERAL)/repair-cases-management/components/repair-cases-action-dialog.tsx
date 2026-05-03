import { Button } from '@servexa-warranty-ai/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@servexa-warranty-ai/ui/components/dialog'
import { useRepairCases } from './repair-cases-provider'

export function RepairCasesActionDialog() {
  const { open, setOpen } = useRepairCases()

  return (
    <Dialog open={open === 'add'} onOpenChange={(state) => setOpen(state ? 'add' : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create repair case</DialogTitle>
          <DialogDescription>Repair case creation flow is now API-ready and can be extended with full form fields.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
