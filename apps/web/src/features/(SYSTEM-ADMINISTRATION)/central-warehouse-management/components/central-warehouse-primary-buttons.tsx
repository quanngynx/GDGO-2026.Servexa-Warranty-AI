import { Button } from '@servexa-warranty-ai/ui/components/button'
import { Warehouse } from 'lucide-react'
import { useCentralWarehouse } from './central-warehouse-provider'

export function CentralWarehousePrimaryButtons() {
  const { setOpen } = useCentralWarehouse()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Warehouse</span> <Warehouse size={18} />
      </Button>
    </div>
  )
}
