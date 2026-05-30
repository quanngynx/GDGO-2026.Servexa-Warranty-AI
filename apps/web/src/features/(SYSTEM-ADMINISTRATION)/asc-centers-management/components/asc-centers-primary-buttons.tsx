import { Button } from '@servexa-warranty-ai/ui/components/button'
import { Building2 } from 'lucide-react'
import { useAscCenters } from './asc-centers-provider'

export function AscCentersPrimaryButtons() {
  const { setOpen } = useAscCenters()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add ASC Center</span> <Building2 size={18} />
      </Button>
    </div>
  )
}
