import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { env } from "@servexa-warranty-ai/env/server";
import { streamText, type UIMessage, convertToModelMessages, wrapLanguageModel } from "ai";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: [
      env.CORS_ORIGIN,
      env.CORS_ORIGIN_WEB,
    ],
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(express.json());

app.post("/ai", async (req, res) => {
  const { messages = [] } = (req.body || {}) as { messages: UIMessage[] };
  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });
  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });
  result.pipeUIMessageStreamToResponse(res);
});

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
