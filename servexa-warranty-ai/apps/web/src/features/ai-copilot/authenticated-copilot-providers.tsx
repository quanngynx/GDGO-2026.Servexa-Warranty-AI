import "@copilotkit/react-core/v2/styles.css";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import type { ReactNode } from "react";

import { env } from "@servexa-warranty-ai/env/web";

const runtimeBase = env.VITE_SERVER_URL.replace(/\/$/, "");

export function AuthenticatedCopilotProviders({ children }: { children: ReactNode }) {
  return (
    <CopilotKitProvider runtimeUrl={`${runtimeBase}/api/copilotkit`} useSingleEndpoint>
      {children}
    </CopilotKitProvider>
  );
}
