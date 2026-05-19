import "@copilotkit/react-core/v2/styles.css";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import { useEffect, useState, type ReactNode } from "react";

import { env } from "@servexa-warranty-ai/env/web";

import { OperationalContextProvider } from "./context/operational-context-provider";
import {
  getCopilotAuthHeaders,
  getCopilotAuthHeadersSync,
} from "./lib/copilot-auth-headers";

const runtimeBase = env.VITE_SERVER_URL.replace(/\/$/, "");

export function AuthenticatedCopilotProviders({ children }: { children: ReactNode }) {
  const [headers, setHeaders] = useState(getCopilotAuthHeadersSync);

  useEffect(() => {
    setHeaders(getCopilotAuthHeadersSync());
    void getCopilotAuthHeaders().then(setHeaders);
    const interval = window.setInterval(() => {
      void getCopilotAuthHeaders().then(setHeaders);
    }, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const providerKey = `${headers["x-client-id"] ?? ""}:${headers.Authorization ? "1" : "0"}`;

  return (
    <CopilotKitProvider
      key={providerKey}
      runtimeUrl={`${runtimeBase}/api/copilotkit`}
      useSingleEndpoint
      headers={headers}
    >
      <OperationalContextProvider>{children}</OperationalContextProvider>
    </CopilotKitProvider>
  );
}
