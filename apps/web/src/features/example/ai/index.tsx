import { env } from "@servexa-warranty-ai/env/web";
import { CopilotKit } from "@copilotkit/react-core";
import { Header } from "@/components/layout/header";
import React, { useState } from "react";
import { z } from "zod";
import "@copilotkit/react-core/v2/styles.css";
import { 
  useFrontendTool,
  useRenderTool,
  useAgentContext,
  useConfigureSuggestions,
  CopilotChat,
} from "@copilotkit/react-core/v2";

import { SERVEXA_COPILOT_AGENT_ID } from "@/features/ai-copilot/constants";
import { useTranslation } from "react-i18next";

interface AgenticChatProps {
  params: Promise<{
    integrationId: string;
  }>;
}

const AgenticChat: React.FC<AgenticChatProps> = ({ params }) => {
    const { t } = useTranslation();
  void React.use(params);

  const runtimeBase = env.VITE_SERVER_URL.replace(/\/$/, "");

  return (
    <>
      <Header />
      <CopilotKit
        runtimeUrl={`${runtimeBase}/api/copilotkit`}
        useSingleEndpoint
        enableInspector
        agent={SERVEXA_COPILOT_AGENT_ID}
      >
        <Chat />
      </CopilotKit>
    </>
  );
};
const Chat = () => {
    const { t } = useTranslation();
  const [background, setBackground] = useState<string>("--copilot-kit-background-color");

  useAgentContext({
    description: 'Name of the user',
    value: 'Bob'
  });

  useFrontendTool({
    name: "change_background",
    description:
      "Change the background color of the chat. Can be anything that the CSS background attribute accepts. Regular colors, linear of radial gradients etc.",
    parameters: z.object({
      background: z.string().describe("The background. Prefer gradients. Only use when asked."),
    }) ,
    handler: async ({ background }: { background: string }) => {
      setBackground(background);
      return {
        status: "success",
        message: `Background changed to ${background}`,
      };
    },
  });

  useRenderTool({
    name: "get_weather",
    parameters: z.object({
      location: z.string(),
    })  ,
    render: ({ args, result, status }: any) => {
      if (status !== "complete") {
        return <div data-testid="weather-info-loading">{t("Loading weather...")}</div>;
      }

      // Some integrations (e.g. LangGraph) deliver tool results as a JSON-encoded
      // string in the ToolMessage content rather than a parsed object. Normalize
      // so property access works in either case; otherwise every field reads as
      // undefined and the card renders empty values.
      let parsed: any = result;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          parsed = {};
        }
      }
      parsed = parsed ?? {};

      return (
        <div data-testid="weather-info">
          <strong>{t("Weather in")}{parsed.city ?? args.location}</strong>
          <div>{t("Temperature:")}{parsed.temperature}{t("°C")}</div>
          <div>{t("Humidity:")}{parsed.humidity}%</div>
          <div>{t("Wind Speed:")}{parsed.windSpeed ?? parsed.wind_speed} {t("mph")}</div>
          <div>{t("Conditions:")}{parsed.conditions}</div>
        </div>
      );
    },
  });

  useConfigureSuggestions({
    suggestions: [
      {
        title: "Change background",
        message: "Change the background to something new.",
      },
      {
        title: "Generate sonnet",
        message: "Write a short sonnet about AI.",
      },
    ],
    available: "always",
  });

  return (
    <div
      className="flex justify-center items-center h-full w-full"
      data-testid="background-container"
      style={{ background }}
    >
      <div className="h-full w-full md:w-8/10 md:h-8/10 rounded-lg">
        <CopilotChat
          agentId={SERVEXA_COPILOT_AGENT_ID}
          className="h-full rounded-2xl max-w-6xl mx-auto"
        />
      </div>
    </div>
  );
};

export default AgenticChat;