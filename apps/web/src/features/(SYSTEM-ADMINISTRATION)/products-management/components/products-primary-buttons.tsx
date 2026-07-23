import { Button } from '@servexa-warranty-ai/ui/components/button'
import { PackagePlus, Download, Upload } from 'lucide-react'
import { useProducts } from './products-provider'
import { useTranslation } from "react-i18next";
import { modelAPI } from '@/libs/api/product-catalog/model/api'
import { toast } from 'sonner'

export function ProductsPrimaryButtons() {
  const { t } = useTranslation();
  const { setOpen } = useProducts()

  const handleExport = async () => {
    try {
      const response = await modelAPI.triggerExportModel();
      const jobId = response?.metadata?.id;
      if (!jobId) {
        toast.error(t('Failed to start export'));
        return;
      }

      toast.info(t('Export started...'));

      const MAX_POLL_DURATION_MS = 5 * 60 * 1000; // 5 minutes timeout
      const startedAt = Date.now();

      // Simple polling for MVP
      const poll = setInterval(async () => {
        try {
          // Guard: stop polling if it has been running too long
          if (Date.now() - startedAt > MAX_POLL_DURATION_MS) {
            clearInterval(poll);
            toast.error(t('Export timed out. Please try again.'));
            return;
          }

          const statusRes = await modelAPI.getExportModel(jobId);
          const job = statusRes?.metadata;
          if (job?.status === 'completed' && job.fileName) {
            clearInterval(poll);
            toast.success(t('Export completed! Downloading...'));
            // Trigger download
            const a = document.createElement('a');
            a.href = job.fileName;
            a.download = 'models.xlsx';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            a.remove();
          } else if (job?.status === 'failed') {
            clearInterval(poll);
            toast.error(t('Export failed: ') + (job.errorMessage || 'Unknown error'));
          } else if (job?.status === 'cancelled') {
            clearInterval(poll);
            toast.info(t('Export was cancelled'));
          }
        } catch (pollErr) {
          console.error('Polling error', pollErr);
          clearInterval(poll);
          toast.error(t('Error checking export status'));
        }
      }, 3000); // Poll every 3 seconds

    } catch (err) {
      toast.error(t('Failed to start export'))
      console.error(err);
    }
  }

  return (
    <div className='flex gap-2'>
      <Button variant='outline' className='space-x-1' onClick={handleExport}>
        <span>{t("Export")}</span> <Download size={18} />
      </Button>
      <Button variant='outline' className='space-x-1' onClick={() => setOpen('import')}>
        <span>{t("Import")}</span> <Upload size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t("Add Model")}</span> <PackagePlus size={18} />
      </Button>
    </div>
  )
}
