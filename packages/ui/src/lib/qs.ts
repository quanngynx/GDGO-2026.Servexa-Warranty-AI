import { stringify } from "qs";

export function qsStringify(
  params: Record<string, any>,
  arrayFormat: "comma" | "brackets" | "repeat" | "indices" = "comma"
): string {
  return stringify(params, { arrayFormat });
}
