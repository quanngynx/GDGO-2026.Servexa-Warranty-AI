import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/(SYSTEM-ADMINISTRATION)/products-management/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/_authenticated/(SYSTEM-ADMINISTRATION)/products-management/"!
    </div>
  );
}
