import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { toast } from "sonner";

import {
  DirectionProvider,
  FontProvider,
  ThemeProvider,
} from "@servexa-warranty-ai/ui/contexts";
import { handleServerError } from "@servexa-warranty-ai/ui/lib";

import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";

import "./index.css";
import { env } from "@servexa-warranty-ai/env/web";
import { useAuthStore } from "./stores/auth-store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (env.VITE_NODE_ENV === "development")
          console.log({ failureCount, error });

        if (failureCount >= 0 && env.VITE_NODE_ENV === "development")
          return false;
        if (failureCount > 3 && env.VITE_NODE_ENV === "production")
          return false;

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        );
      },
      refetchOnWindowFocus: env.VITE_NODE_ENV === "production",
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error("Content not modified!");
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          const { isAuthenticated } = useAuthStore.getState();
          if (!isAuthenticated) {
            return;
          }
          const path = router.history.location.pathname;
          if (path === "/sign-in") {
            return;
          }
          toast.error("Session expired!");
          useAuthStore.getState().auth.reset();
          const redirect = `${router.history.location.href}`;
          router.navigate({ to: "/sign-in", search: { redirect } });
        }
        if (error.response?.status === 500) {
          toast.error("Internal Server Error!");
          // Only navigate to error page in production to avoid disrupting HMR in development
          if (env.VITE_NODE_ENV === "production") {
            router.navigate({ to: "/500" });
          }
        }
        if (error.response?.status === 403) {
          // router.navigate("/forbidden", { replace: true });
        }
      }
    },
  }),
});

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => <Loader />,
  context: { queryClient },
});

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("Root element not found");
}

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>
              <RouterProvider router={router} />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
