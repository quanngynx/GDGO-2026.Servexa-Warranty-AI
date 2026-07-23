import { SelectDropdown } from "@/components/select-dropdown";
import { Button } from "@servexa-warranty-ai/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@servexa-warranty-ai/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@servexa-warranty-ai/ui/components/form";
import { Input } from "@servexa-warranty-ai/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type Model } from '../data/schema'
import { useTranslation } from "react-i18next";
import { useCreateModelMutation } from '../hooks/use-create-model-mutation'
import { useUpdateModelMutation } from '../hooks/use-update-model-mutation'
import { useModelQuery } from '../hooks/use-model-query'
import { useCategoriesQuery } from '../../product-categories-management/hooks/use-categories-query'
import { listPayloadFromApi } from '@/libs/api/bases/extract-metadata'
import type { ResponseCategoryListDto } from '@/libs/api/product-catalog/category/data-transfer-object'
import { useEffect } from "react";
import { Skeleton } from "@servexa-warranty-ai/ui/components/skeleton";

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  modelCode: z.string().min(1, "Model Code is required."),
  categoryId: z.string().min(1, "Category is required."),
  status: z.string().optional(),
})

type ModelForm = z.infer<typeof formSchema>;

type ProductsActionDialogProps = {
  currentRow?: Model
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: ProductsActionDialogProps) {
  const { t } = useTranslation();
  const isEdit = !!currentRow;
  
  const createMutation = useCreateModelMutation();
  const updateMutation = useUpdateModelMutation();

  const { data: categoryData } = useCategoriesQuery({ limit: 1000 });
  const categoryList = listPayloadFromApi<ResponseCategoryListDto>(categoryData);
  const categories = categoryList?.items ?? [];

  const { data: modelDetailResponse, isLoading: isLoadingModel } = useModelQuery(
    currentRow?.id ?? '', 
    { enabled: isEdit && open }
  );

  const modelDetail = modelDetailResponse?.metadata;

  const form = useForm<ModelForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      modelCode: '',
      categoryId: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (modelDetail) {
      form.reset({
        name: modelDetail.name,
        modelCode: modelDetail.modelCode,
        categoryId: modelDetail.categoryId,
        status: modelDetail.status,
      })
    } else {
      form.reset({
        name: '',
        modelCode: '',
        categoryId: '',
        status: 'active',
      })
    }
  }, [modelDetail, form, open]);

  const onSubmit = (values: ModelForm) => {
    if (isEdit && currentRow) {
      updateMutation.mutate({ modelId: currentRow.id, data: values }, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        }
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        }
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset();
        }
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? t("Edit Model") : t("Add New Model")}</DialogTitle>
          <DialogDescription>
            {isEdit ? t("Update the model details here.") : t("Create a new model here.")}
            {" "}
            {t("Click save when you're done.")}
          </DialogDescription>
        </DialogHeader>
        
        {isEdit && isLoadingModel ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="h-auto w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3">
            <Form {...form}>
              <form
                id="model-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-0.5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-end">
                        {t("Name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("e.g. Model X")}
                          className="col-span-4"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelCode"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-end">
                        {t("Model Code")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("e.g. MX-100")}
                          className="col-span-4"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-end">{t("Category")}</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("Select a category")}
                        className="col-span-4"
                        items={categories.map((c) => ({
                          label: c.name,
                          value: c.id,
                        }))}
                      />
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                      <FormLabel className="col-span-2 text-end">{t("Status")}</FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("Select status")}
                        className="col-span-4"
                        items={[
                          { label: 'Active', value: 'active' },
                          { label: 'Inactive', value: 'inactive' },
                        ]}
                      />
                      <FormMessage className="col-span-4 col-start-3" />
                    </FormItem>
                  )}
                />

              </form>
            </Form>
          </div>
        )}

        <DialogFooter>
          <Button type="submit" form="model-form" disabled={isLoading || (isEdit && isLoadingModel)}>
            {isLoading ? t("Saving...") : t("Save changes")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
