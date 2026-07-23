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
import { useCreatePurchaseLocationGroupMutation } from '../hooks/use-create-purchase-location-group-mutation'
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  code: z.string().min(1, 'Code is required').trim(),
  description: z.string().optional(),
})

type GroupForm = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PurchaseLocationGroupActionDialog({ open, onOpenChange }: Props) {
    const { t } = useTranslation();
  const form = useForm<GroupForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  })

  const { mutateAsync: createGroup, isPending } = useCreatePurchaseLocationGroupMutation()

  const onSubmit = async (values: GroupForm) => {
    try {
      await createGroup(values)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Handle error if needed
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
          <DialogTitle>{t("Add New Purchase Location Group")}</DialogTitle>
          <DialogDescription>
            {t("Create new group here. Click save when you\'re done.")}</DialogDescription>
        </DialogHeader>
        <div className='py-1 pe-3'>
          <Form {...form}>
            <form
              id='group-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>{t("Name *")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("Enter group name")}
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
                    <FormLabel className='col-span-2 text-end'>{t("Code *")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("e.g: retail_store")}
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            {t("Cancel")}</Button>
          <Button type='submit' form='group-form' disabled={isPending}>
            {isPending ? 'Saving...' : 'Add group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
