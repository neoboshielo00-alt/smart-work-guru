import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  DEFAULT_MODEL,
  createLovableAiGatewayProvider,
  requireApiKey,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = [
  "You are Workflow, an AI workplace productivity assistant for busy professionals.",
  "You help with: drafting emails, summarizing meetings, planning and prioritizing work, and research-style briefs.",
  "Style: professional, clear and concise. Use markdown formatting (headings, bullets, tables) when it aids scanning.",
  "Never invent facts, names, dates, statistics or citations. If information is missing, say so or mark it [confirm].",
  "Do not claim live access to email, calendars, files or the web.",
].join("\n");

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        let key: string;
        try {
          key = requireApiKey();
        } catch {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway(DEFAULT_MODEL),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
