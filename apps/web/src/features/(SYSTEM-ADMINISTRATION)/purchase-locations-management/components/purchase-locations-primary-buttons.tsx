import { Button } from '@servexa-warranty-ai/ui/components/button'
import { MapPinPlus } from 'lucide-react'
import { usePurchaseLocations } from './purchase-locations-provider'

export function PurchaseLocationsPrimaryButtons() {
  const { setOpen } = usePurchaseLocations()
  return (
    <div className='flex gap-2'>
      <Button variant='outline' className='space-x-1' onClick={() => setOpen('add-group')}>
        <span>Add Group</span> <MapPinPlus size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('add-location')}>
        <span>Add Location</span> <MapPinPlus size={18} />
      </Button>
    </div>
  )
}
