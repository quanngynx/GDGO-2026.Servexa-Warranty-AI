import { useQuery } from "@tanstack/react-query";

import { technicianApi } from "@/libs/api/human-resources/technician/api";
import type { TechnicianProfileDto } from "@/libs/api/human-resources/technician/data-transfer-object";

export function technicianLabel(tech: TechnicianProfileDto): string {
  const name = tech.user?.fullName?.trim() || tech.user?.username || "Technician";
  const availability = tech.isAvailable ? "" : " · unavailable";
  return `${name} (${tech.skillLevel})${availability}`;
}

export function useTechniciansQuery(enabled = true) {
  return useQuery({
    queryKey: ["technicians", "hitl-assignment"],
    enabled,
    queryFn: async () => {
      const res = await technicianApi.findAll({
        page: 1,
        limit: 100,
        isAvailable: true,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      return res?.metadata.items ?? [];
    },
  });
}
