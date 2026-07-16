import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@servexa-warranty-ai/ui/components/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@servexa-warranty-ai/ui/components/form'
import { Input } from '@servexa-warranty-ai/ui/components/input'
import { Button } from '@servexa-warranty-ai/ui/components/button'
import { Textarea } from '@servexa-warranty-ai/ui/components/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreatePurchaseLocationMutation } from '../hooks/use-create-purchase-location-mutation'
import { usePurchaseLocationGroupsQuery } from '../hooks/use-purchase-location-groups-query'

const formSchema = z.object({
  groupId: z.string().min(1, 'Group is required'),
  name: z.string().min(1, 'Name is required').trim(),
  code: z.string().min(1, 'Code is required').trim(),
  website: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
})

type LocationForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PurchaseLocationActionDialog({ open, onOpenChange }: Props) {
  const form = useForm<LocationForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: '',
      name: '',
      code: '',
      website: '',
      address: '',
      description: '',
    },
  })

  const { data: groupsData } = usePurchaseLocationGroupsQuery({ limit: 1000 })
  const groups = groupsData?.metadata?.items || []

  const { mutateAsync: createLocation, isPending } = useCreatePurchaseLocationMutation()

  const onSubmit = async (values: LocationForm) => {
    try {
      await createLocation(values)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Add New Purchase Location</DialogTitle>
          <DialogDescription>
            Create new location here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='location-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='groupId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Group *</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select group'
                      className='col-span-4'
                      items={groups.map((g) => ({
                        label: g.name,
                        value: g.id,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Location Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter location name'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Location Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g: store_01'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://example.com'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter address (optional)'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end mt-2'>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter description (optional)'
                        className='col-span-4 resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='location-form' disabled={isPending}>
            {isPending ? 'Saving...' : 'Add location'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
