import { useMemo } from "react";

import { SelectDropdown } from "@/components/select-dropdown";
import { Label } from "@servexa-warranty-ai/ui/components/label";

import {
  technicianLabel,
  useTechniciansQuery,
} from "../hooks/use-technicians-query";

type HitlTechnicianSelectFieldProps = {
  value: string;
  onValueChange: (technicianId: string, technicianName?: string) => void;
  disabled?: boolean;
};

export function HitlTechnicianSelectField({
  value,
  onValueChange,
  disabled,
}: HitlTechnicianSelectFieldProps) {
  const { data: technicians = [], isPending, isError } = useTechniciansQuery(true);

  const items = useMemo(
    () =>
      technicians.map((tech) => ({
        value: tech.id,
        label: technicianLabel(tech),
      })),
    [technicians],
  );

  const handleChange = (nextId: string) => {
    const selected = technicians.find((t) => t.id === nextId);
    const name =
      selected?.user?.fullName?.trim() || selected?.user?.username || undefined;
    onValueChange(nextId, name);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="hitl-tech-select">Technician</Label>
      <SelectDropdown
        withFormControl={false}
        isControlled
        defaultValue={value || undefined}
        onValueChange={handleChange}
        placeholder="Select a technician"
        isPending={isPending}
        disabled={disabled || isError}
        className="w-full"
        items={items}
      />
      {isError ? (
        <p className="text-xs text-destructive">Could not load technicians.</p>
      ) : null}
      {!isPending && !isError && items.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No available technicians found. Run the technician profile seed first.
        </p>
      ) : null}
    </div>
  );
}
