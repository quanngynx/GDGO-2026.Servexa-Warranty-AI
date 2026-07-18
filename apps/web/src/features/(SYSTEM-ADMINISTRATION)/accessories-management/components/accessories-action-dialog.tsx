import { useState, useEffect } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { ImagePlus, Package, X } from 'lucide-react'

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
import { SelectDropdown } from '@/components/select-dropdown'
import { useCategoriesQuery } from '../../product-categories-management/hooks/use-categories-query'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseCategoryListDto } from '@/libs/api/product-catalog/category/data-transfer-object'
import { type Accessory } from '../data/schema'
import { useCreateAccessoryMutation } from '../hooks/use-create-accessory-mutation'
import { useUpdateAccessoryMutation } from '../hooks/use-update-accessory-mutation'

const route = getRouteApi('/_authenticated/(SYSTEM-ADMINISTRATION)/accessories-management/')

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  partNumber: z.string().min(1, 'Part Number is required'),
  itemNumber: z.string().optional(),
  englishName: z.string().optional(),
  partGroupNumber: z.string().optional(),
  partGroupName: z.string().optional(),
  partDescription: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  unitPrice: z.number().min(0).optional(),
  customerPrice: z.number().min(0).optional(),
  // Stock fields when warehouse / ASC center is selected
  currentStock: z.number().min(0).optional(),
  minStockLevel: z.number().min(0).optional(),
  maxStockLevel: z.number().min(0).optional(),
  location: z.string().optional(),
})

type AccessoryFormValues = z.infer<typeof formSchema>

type AccessoriesActionDialogProps = {
  currentRow?: Accessory
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AccessoriesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: AccessoriesActionDialogProps) {
  const { t } = useTranslation()
  const search = route.useSearch()

  const totalWarehouseId = search.totalWarehouseIds?.split(',')[0]
  const ascCenterId = search.ascCenterIds?.split(',')[0]

  const isEdit = !!currentRow
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { data: categoriesData } = useCategoriesQuery({ limit: 100 })
  const categoryList =
    listPayloadFromApi<ResponseCategoryListDto>(categoriesData)?.items ?? []

  const createMutation = useCreateAccessoryMutation()
  const updateMutation = useUpdateAccessoryMutation()

  const accessoryObj = currentRow?.accessory || currentRow
  const existingImageUrl = accessoryObj?.imageUrl || currentRow?.imageUrl

  const form = useForm<AccessoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      partNumber: '',
      itemNumber: '',
      englishName: '',
      partGroupNumber: '',
      partGroupName: '',
      partDescription: '',
      description: '',
      categoryId: '',
      status: 'active',
      unitPrice: 0,
      customerPrice: 0,
      currentStock: 0,
      minStockLevel: 0,
      maxStockLevel: 100,
      location: '',
    },
  })

  useEffect(() => {
    if (open) {
      if (currentRow) {
        const item = currentRow.accessory || currentRow
        form.reset({
          name: item.name || '',
          partNumber: item.partNumber || '',
          itemNumber: item.itemNumber || '',
          englishName: item.englishName || '',
          partGroupNumber: item.partGroupNumber || '',
          partGroupName: item.partGroupName || '',
          partDescription: item.partDescription || '',
          description: item.description || '',
          categoryId: item.categoryId || item.category?.id || '',
          status: (item.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive',
          unitPrice: typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(String(item.unitPrice || 0)),
          customerPrice: typeof item.customerPrice === 'number' ? item.customerPrice : parseFloat(String(item.customerPrice || 0)),
          currentStock: currentRow.currentStock ?? 0,
          minStockLevel: currentRow.minStockLevel ?? 0,
          maxStockLevel: currentRow.maxStockLevel ?? 100,
          location: currentRow.location || '',
        })
      } else {
        form.reset({
          name: '',
          partNumber: '',
          itemNumber: '',
          englishName: '',
          partGroupNumber: '',
          partGroupName: '',
          partDescription: '',
          description: '',
          categoryId: '',
          status: 'active',
          unitPrice: 0,
          customerPrice: 0,
          currentStock: 0,
          minStockLevel: 0,
          maxStockLevel: 100,
          location: '',
        })
      }
      setSelectedFile(null)
      setPreviewUrl(existingImageUrl || null)
    }
  }, [open, currentRow])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const onSubmit = async (values: AccessoryFormValues) => {
    const accessoryId = currentRow?.accessoryId || currentRow?.id

    const formData = new FormData()
    if (selectedFile) {
      formData.append('image', selectedFile)
    }

    // Append JSON attributes
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value))
      }
    })

    if (isEdit && accessoryId) {
      await updateMutation.mutateAsync({
        accessoryId,
        data: formData,
        totalWarehouseId,
        ascCenterId,
      })
    } else {
      await createMutation.mutateAsync({
        data: formData,
        totalWarehouseId,
        ascCenterId,
      })
    }

    onOpenChange(false)
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? t('Edit Accessory') : t('Add New Accessory')}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t('Update accessory details and image.')
              : t('Create a new accessory item.')}
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-1 py-2 pe-3 space-y-4'>
          <Form {...form}>
            <form id='accessory-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              {/* Image Upload Area */}
              <div className='flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/30'>
                {previewUrl ? (
                  <div className='relative h-32 w-32 rounded-md overflow-hidden border shadow-sm group'>
                    <img
                      src={previewUrl}
                      alt='Accessory preview'
                      className='h-full w-full object-cover'
                    />
                    <button
                      type='button'
                      onClick={handleRemoveImage}
                      className='absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity'
                    >
                      <X className='h-3.5 w-3.5' />
                    </button>
                  </div>
                ) : (
                  <label className='flex flex-col items-center justify-center cursor-pointer space-y-2 py-4'>
                    <div className='h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground'>
                      <ImagePlus className='h-6 w-6' />
                    </div>
                    <span className='text-xs font-medium text-muted-foreground'>
                      {t('Click to upload accessory image (.webp, .png, .jpg)')}
                    </span>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                      className='hidden'
                    />
                  </label>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Accessory Name')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('e.g. Remote Control')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='partNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Part Number')} *</FormLabel>
                      <FormControl>
                        <Input placeholder={t('e.g. ACC-10092')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='itemNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Item Number')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('e.g. ITM-9988')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='englishName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('English Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('e.g. Smart Remote Control')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Category')}</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder={t('Select category')}
                        items={categoryList.map((cat) => ({
                          label: cat.name,
                          value: cat.id,
                        }))}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Status')}</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder={t('Select status')}
                        items={[
                          { label: t('Active'), value: 'active' },
                          { label: t('Inactive'), value: 'inactive' },
                        ]}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='unitPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Unit Price (VND)')}</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='0'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='customerPrice'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Customer Price (VND)')}</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='0'
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Group & Specs */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t'>
                <FormField
                  control={form.control}
                  name='partGroupNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Part Group No.')}</FormLabel>
                      <FormControl>
                        <Input placeholder='PG-01' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='partGroupName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Part Group Name')}</FormLabel>
                      <FormControl>
                        <Input placeholder='Controls' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='partDescription'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('Part Description')}</FormLabel>
                      <FormControl>
                        <Input placeholder='Wireless IR' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Warehouse / ASC Stock allocation section if filter is active */}
              {(totalWarehouseId || ascCenterId) && (
                <div className='space-y-3 pt-2 border-t bg-muted/20 p-3 rounded-md'>
                  <span className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                    {totalWarehouseId
                      ? t('Total Warehouse Stock Allocation')
                      : t('ASC Center Stock Allocation')}
                  </span>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    <FormField
                      control={form.control}
                      name='currentStock'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('Current Stock')}</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min='0'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='minStockLevel'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('Min Stock')}</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min='0'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='maxStockLevel'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('Max Stock')}</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              min='0'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {totalWarehouseId && (
                      <FormField
                        control={form.control}
                        name='location'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('Bin Location')}</FormLabel>
                            <FormControl>
                              <Input placeholder='Shelf A-1' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>

        <DialogFooter className='pt-2 border-t'>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
          <Button type='submit' form='accessory-form' disabled={isLoading}>
            {isLoading ? t('Saving...') : t('Save changes')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
