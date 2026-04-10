import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/central-warehouse-management/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello
      "/_authenticated/(SYSTEM-ADMINISTRATION)/central-warehouse-management/"!
    </div>
  );
}
