import { useOperationalContextPatch } from "./operational-context-provider";

/** Selected entity slice for copilot (inventory, technician, etc.). */
export function useSelectedEntityContext() {
  const { context, setOperationalContext } = useOperationalContextPatch();
  return {
    selectedInventoryItemId: context.selectedInventoryItemId ?? null,
    selectedTechnicianId: context.selectedTechnicianId ?? null,
    setSelectedEntityContext: setOperationalContext,
  };
}
