'use client'

import { SelectDropdown } from '@/components/select-dropdown'
import { Button } from '@servexa-warranty-ai/ui/components/button'
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
import type { CustomerGroup } from '@/libs/api/human-resources/customer/data-transfer-object'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { customerGroupOptions } from '../data/data'
import { type Customer } from '../data/schema'
import { useCreateCustomerMutation } from '../hooks/use-create-customer-mutation'
import { useUpdateCustomerMutation } from '../hooks/use-update-customer-mutation'

const customerGroupSchema = z.enum([
  'individual',
  'dealer_store',
  'store_representative',
  'supplier',
  'invoice',
  'company',
])

const formSchema = z.object({
  customerGroup: customerGroupSchema,
  fullName: z.string().min(1, 'Full name is required.'),
  phone1: z.string().min(1, 'Phone number is required.'),
  phone2: z.string().optional(),
  email: z.union([z.literal(''), z.email()]).optional(),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  contactPerson: z.string().optional(),
})

type CustomerForm = z.infer<typeof formSchema>

type CustomerActionDialogProps = {
  currentRow?: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: CustomerActionDialogProps) {
  const isEdit = !!currentRow
  const createMutation = useCreateCustomerMutation()
  const updateMutation = useUpdateCustomerMutation()

  const form = useForm<CustomerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerGroup: 'individual',
      fullName: '',
      phone1: '',
      phone2: '',
      email: '',
      address: '',
      taxCode: '',
      bankName: '',
      accountNumber: '',
      contactPerson: '',
    },
  })

  const resetForm = () => {
    if (currentRow) {
      form.reset({
        customerGroup: currentRow.customerGroup,
        fullName: currentRow.fullName,
        phone1: currentRow.phone1,
        phone2: currentRow.phone2 ?? '',
        email: currentRow.email ?? '',
        address: currentRow.address ?? '',
        taxCode: currentRow.taxCode ?? '',
        bankName: currentRow.bankName ?? '',
        accountNumber: currentRow.accountNumber ?? '',
        contactPerson: currentRow.contactPerson ?? '',
      })
    } else {
      form.reset({
        customerGroup: 'individual',
        fullName: '',
        phone1: '',
        phone2: '',
        email: '',
        address: '',
        taxCode: '',
        bankName: '',
        accountNumber: '',
        contactPerson: '',
      })
    }
  }

  const onSubmit = (values: CustomerForm) => {
    const payload = {
      customerGroup: values.customerGroup as CustomerGroup,
      fullName: values.fullName,
      phone1: values.phone1,
      phone2: values.phone2 || undefined,
      email: values.email || undefined,
      address: values.address || undefined,
      taxCode: values.taxCode || undefined,
      bankName: values.bankName || undefined,
      accountNumber: values.accountNumber || undefined,
      contactPerson: values.contactPerson || undefined,
    }

    if (isEdit && currentRow) {
      updateMutation.mutate(
        { id: currentRow.id, data: payload },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        },
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (state) resetForm()
        else form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update customer details.' : 'Create a new customer.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='customer-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='customerGroup'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer group</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select group'
                    items={customerGroupOptions.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder='Full name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone 1</FormLabel>
                  <FormControl>
                    <Input placeholder='+84...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone2'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone 2</FormLabel>
                  <FormControl>
                    <Input placeholder='Optional' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='email@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder='Address' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='customer-form' disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
