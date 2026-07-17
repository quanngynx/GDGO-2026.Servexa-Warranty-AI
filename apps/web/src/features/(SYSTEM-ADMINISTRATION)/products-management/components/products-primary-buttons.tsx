import { Button } from '@servexa-warranty-ai/ui/components/button'
import { PackagePlus } from 'lucide-react'
import { useProducts } from './products-provider'
import { useTranslation } from "react-i18next";

export function ProductsPrimaryButtons() {
    const { t } = useTranslation();
  const { setOpen } = useProducts()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>{t("Add Model")}</span> <PackagePlus size={18} />
      </Button>
    </div>
  )
}
