import { useEffect } from 'react'
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
import { useUpdatePurchaseLocationMutation } from '../hooks/use-update-purchase-location-mutation'
import { usePurchaseLocationGroupsQuery } from '../hooks/use-purchase-location-groups-query'
import type { ResponsePurchaseLocationDto } from '@/libs/api/purchase-channels/purchase-location/data-transfer-object'
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  groupId: z.string().min(1, 'Group is required'),
  name: z.string().min(1, 'Name is required').trim(),
  code: z.string().min(1, 'Code is required').trim(),
  website: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
})

type LocationForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ResponsePurchaseLocationDto
}

export function PurchaseLocationActionDialog({ open, onOpenChange, currentRow }: Props) {
    const { t } = useTranslation();
  const form = useForm<LocationForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: '',
      name: '',
      code: '',
      website: '',
      address: '',
      description: '',
      isActive: true,
    },
  })

  const { data: groupsData } = usePurchaseLocationGroupsQuery({ limit: 1000 })
  const groups = groupsData?.metadata?.items || []

  const { mutateAsync: createLocation, isPending: isCreating } = useCreatePurchaseLocationMutation()
  const { mutateAsync: updateLocation, isPending: isUpdating } = useUpdatePurchaseLocationMutation()

  const isPending = isCreating || isUpdating
  const isEditing = !!currentRow

  useEffect(() => {
    if (currentRow && open) {
      form.reset({
        groupId: currentRow.groupId,
        name: currentRow.name,
        code: currentRow.code,
        website: currentRow.website || '',
        address: currentRow.address || '',
        description: currentRow.description || '',
        isActive: currentRow.isActive,
      })
    } else if (!open) {
      form.reset()
    }
  }, [currentRow, open, form])

  const onSubmit = async (values: LocationForm) => {
    try {
      if (isEditing) {
        await updateLocation({ id: currentRow.id, data: values })
      } else {
        await createLocation(values)
      }
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
          <DialogTitle>{isEditing ? 'Edit Purchase Location' : 'Add New Purchase Location'}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Make changes to the location here. Click save when you're done." : "Create new location here. Click save when you're done."}
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
                    <FormLabel className='col-span-2 text-end'>{t("Group *")}</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={t("Select group")}
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
                    <FormLabel className='col-span-2 text-end'>{t("Location Name *")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Enter location name")}
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
                    <FormLabel className='col-span-2 text-end'>{t("Location Code *")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("e.g: store_01")}
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
                    <FormLabel className='col-span-2 text-end'>{t("Website")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("https://example.com")}
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
                    <FormLabel className='col-span-2 text-end'>{t("Address")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Enter address (optional)")}
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
                    <FormLabel className='col-span-2 text-end mt-2'>{t("Description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("Enter description (optional)")}
                        className='col-span-4 resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {isEditing && (
                <FormField
                  control={form.control}
                  name='isActive'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>{t("Status")}</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value ? 'true' : 'false'}
                        onValueChange={(value) => field.onChange(value === 'true')}
                        placeholder={t("Select status")}
                        className='col-span-4'
                        items={[
                          { label: 'Active', value: 'true' },
                          { label: 'Inactive', value: 'false' },
                        ]}
                      />
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            {t("Cancel")}</Button>
          <Button type='submit' form='location-form' disabled={isPending}>
            {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Add location'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
