import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@servexa-warranty-ai/ui/components/sonner";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TooltipProvider } from "@servexa-warranty-ai/ui/components/tooltip";

import Loader from "@/components/loader";
import { NavigationProgress } from "@/components/navigation-progress";
import { NotFoundError } from "@/features/errors/not-found-error";
import { GeneralError } from "@/features/errors/general-error";
import { env } from "@servexa-warranty-ai/env/web";
import { useAuthStore } from "@/stores/auth-store";

export interface RouterAppContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  // Session must hydrate in beforeLoad so child beforeLoad (e.g. /_authenticated) sees updated store.
  // TanStack Router runs beforeLoad before route.load; a root-only loader runs too late for that guard.
  beforeLoad: async () => {
    await useAuthStore.getState().auth.initializeAuth();
  },
  pendingComponent: () => <Loader />,
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
    <TooltipProvider>
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
    </TooltipProvider>
  );
}
