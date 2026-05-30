import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/features/(GENERAL)/dashboard";

export const Route = createFileRoute("/_authenticated/")({
  beforeLoad: () => {
    return {
      title: "Dashboard",
    };
  },
  component: Dashboard,
});
