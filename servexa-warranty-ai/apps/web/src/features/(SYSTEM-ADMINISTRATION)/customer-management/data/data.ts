import { User, Users } from "lucide-react";
import { type CustomerGroup } from "./schema";

export const customerGroups = new Map<CustomerGroup, string>([
  [
    "individual",
    "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200",
  ],
  ["other", "bg-neutral-300/40 border-neutral-300"],
]);

export const customerGroupOptions = [
  {
    label: "Individual",
    value: "individual",
    icon: User,
  },
  {
    label: "Other",
    value: "other",
    icon: Users,
  },
] as const;
