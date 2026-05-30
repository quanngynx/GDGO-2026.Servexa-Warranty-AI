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

export function RepairCasesDeleteDialog() {
  const { open, setOpen } = useRepairCases()

  return (
    <Dialog open={open === 'delete'} onOpenChange={(state) => setOpen(state ? 'delete' : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete repair case</DialogTitle>
          <DialogDescription>Delete action can be triggered from row actions once full table actions are enabled.</DialogDescription>
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
