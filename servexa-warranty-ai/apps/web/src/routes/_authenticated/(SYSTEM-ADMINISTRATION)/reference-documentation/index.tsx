import { createFileRoute } from "@tanstack/react-router";
import { ReferenceDocumentation } from "@/features/(REFERENCES-DOCUMENTATION)/references-documentation";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/reference-documentation/"
)({
  component: ReferenceDocumentation,
});
