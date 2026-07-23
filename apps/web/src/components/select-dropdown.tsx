import { Loader } from "lucide-react";
import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import { FormControl } from "@servexa-warranty-ai/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@servexa-warranty-ai/ui/components/select";
import { useTranslation } from "react-i18next";

type SelectDropdownProps = {
  onValueChange?: (value: string) => void;
  defaultValue: string | undefined;
  placeholder?: string;
  isPending?: boolean;
  items: { label: string; value: string }[] | undefined;
  disabled?: boolean;
  className?: string;
  isControlled?: boolean;
  /** When false, omits FormControl (for use outside react-hook-form FormProvider). */
  withFormControl?: boolean;
};

export function SelectDropdown({
  defaultValue,
  onValueChange,
  isPending,
  items,
  placeholder,
  disabled,
  className = "",
  isControlled = false,
  withFormControl = true,
}: SelectDropdownProps) {
    const { t } = useTranslation();
  const defaultState = isControlled
    ? { value: defaultValue, onValueChange }
    : { defaultValue, onValueChange };
  const trigger = (
    <SelectTrigger disabled={disabled} className={cn(className)}>
      <SelectValue placeholder={placeholder ?? "Select"} />
    </SelectTrigger>
  );
  return (
    <Select {...defaultState}>
      {withFormControl ? <FormControl>{trigger}</FormControl> : trigger}
      <SelectContent>
        {isPending ? (
          <SelectItem disabled value="loading" className="h-14">
            <div className="flex items-center justify-center gap-2">
              <Loader className="h-5 w-5 animate-spin" />
              {"  "}
              {t("Loading...")}</div>
          </SelectItem>
        ) : (
          items?.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
