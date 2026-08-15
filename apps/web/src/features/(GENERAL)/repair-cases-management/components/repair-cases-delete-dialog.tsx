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
import { useTranslation } from "react-i18next";

export function RepairCasesDeleteDialog() {
    const { t } = useTranslation();
  const { open, setOpen } = useRepairCases()

  return (
    <Dialog open={open === 'delete'} onOpenChange={(state) => setOpen(state ? 'delete' : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Delete repair case")}</DialogTitle>
          <DialogDescription>{t("Delete action can be triggered from row actions once full table actions are enabled.")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(null)}>
            {t("Close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
