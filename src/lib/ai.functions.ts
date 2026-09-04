import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import {
  DEFAULT_MODEL,
  createLovableAiGatewayProvider,
  requireApiKey,
} from "@/lib/ai-gateway.server";

const Input = z.object({
  tool: z.enum(["email", "notes", "planner", "research"]),
  input: z.string().min(1, "Please describe what you need."),
  options: z.record(z.string(), z.string()).default({}),
});

function buildPrompt(
  tool: z.infer<typeof Input>["tool"],
  input: string,
  options: Record<string, string>,
): string {
  switch (tool) {
    case "email":
      return [
        `ROLE: Professional business email writer.`,
        `TASK: Draft a complete, ready-to-send email for the request below.`,
        `TONE: ${options['tone'] ?? "Professional"}. AUDIENCE: ${options['audience'] ?? "Client"}.`,
        `CONSTRAINTS: Clear subject line, concise body (under 180 words), concrete call to action. Mark any names, dates or figures you cannot verify as [confirm].`,
        `OUTPUT (markdown): **Subject:** … then the email body, then **Alternative subject lines:** (3 bullets).`,
        ``,
        `REQUEST: ${input}`,
      ].join("\n");
    case "notes":
      return [
        `ROLE: Executive meeting-notes analyst.`,
        `TASK: Summarize the raw meeting notes or transcript below.`,
        `CONSTRAINTS: Never invent owners, dates or facts. Use [unassigned] / [no date] when missing.`,
        `OUTPUT (markdown) with exactly these sections: ## Summary (2-3 sentences), ## Key Points (bullets), ## Decisions (bullets), ## Action Items (markdown table: Action | Owner | Deadline), ## Risks & Open Questions (bullets).`,
        ``,
        `NOTES:\n${input}`,
      ].join("\n");
    case "planner":
      return [
        `ROLE: Chief-of-staff productivity planner.`,
        `TASK: Turn the task dump below into a prioritized, time-blocked plan for: ${options['horizon'] ?? "Today"}.`,
        `CONSTRAINTS: Rank by impact × urgency. Schedule around fixed meetings. Give realistic estimates. Never invent deadlines.`,
        `OUTPUT (markdown): ## Top Priorities (ranked, with one-line reason), ## Suggested Schedule (markdown table: Time | Block | Task), ## Defer or Delegate (bullets), ## Coaching Note (1-2 sentences).`,
        ``,
        `TASKS:\n${input}`,
      ].join("\n");
    case "research":
      return [
        `ROLE: Rigorous business research analyst.`,
        `TASK: Produce a ${options['depth'] ?? "Standard brief"} research brief on the question below.`,
        `CONSTRAINTS: Separate established knowledge from analysis. Do NOT fabricate statistics, quotes, URLs or citations — list uncertain items under "Verify".`,
        `OUTPUT (markdown): ## Executive Summary, ## Key Insights (bullets), ## Trade-offs & Considerations (bullets), ## Recommended Next Steps (numbered), ## Verify (facts/figures needing human confirmation).`,
        ``,
        `QUESTION: ${input}`,
      ].join("\n");
  }
}

function friendlyError(e: unknown): Error {
  const msg = e instanceof Error ? e.message : String(e);
  const status = (e as { statusCode?: number })?.statusCode;
  if (status === 429 || msg.includes("429"))
    return new Error("Rate limit reached — please wait a moment and try again.");
  if (status === 402 || msg.includes("402"))
    return new Error("AI credits exhausted. Add credits in your workspace billing settings.");
  if (status === 403 || msg.includes("403"))
    return new Error("AI access is blocked for this workspace. Check workspace settings.");
  if (status === 400 || msg.includes("400"))
    return new Error("The request was invalid — try simplifying your input.");
  return new Error(msg || "The assistant is unavailable right now. Please try again.");
}

export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireApiKey());
    try {
      const result = streamText({
        model: gateway(DEFAULT_MODEL),
        prompt: buildPrompt(data.tool, data.input, data.options),
      });
      return { text: await result.text };
    } catch (e) {
      throw friendlyError(e);
    }
  });
