import { Toaster } from "@servexa-warranty-ai/ui/components/sonner";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { NotFoundError } from "@/features/errors/not-found-error";
import { GeneralError } from "@/features/errors/general-error";
import { env } from "@servexa-warranty-ai/env/web";
import { NavigationProgress } from "@/components/navigation-progress";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
  head: () => ({
    meta: [
      {
        title: "servexa-warranty-ai",
      },
      {
        name: "description",
        content: "servexa-warranty-ai is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
});

function RootComponent() {
  return (
    <>
      <NavigationProgress />
      <HeadContent />
      <Outlet />
      <Toaster richColors duration={5000} />
      {env.VITE_NODE_ENV === "development" && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  );
}
