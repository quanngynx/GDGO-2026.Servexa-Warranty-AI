import { Button } from '@servexa-warranty-ai/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@servexa-warranty-ai/ui/components/dialog'

type RepairCasesMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RepairCasesMultiDeleteDialog({
  open,
  onOpenChange,
}: RepairCasesMultiDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete selected repair cases</DialogTitle>
          <DialogDescription>Bulk delete is available through the repair-case API and ready for table selection integration.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
