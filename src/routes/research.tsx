import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workflow AI Assistant" },
      {
        name: "description",
        content:
          "Get structured research briefs with executive summaries, insights, trade-offs and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Workflow AI Assistant" },
      {
        property: "og:description",
        content: "Structured business research briefs with insights, trade-offs and next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell>
      <ToolWorkbench
        tool="research"
        icon="✎"
        title="AI Research Assistant"
        subtitle="insights + structured summaries"
        inputLabel="What do you need to understand?"
        placeholder="e.g. What should we consider before moving our billing in-house?"
        sample="What are the trade-offs of usage-based pricing versus seat-based pricing for a mid-market B2B SaaS product?"
        cta="Run research brief"
        loadingLabel="Researching and structuring…"
        selects={[
          {
            key: "depth",
            label: "Depth",
            options: ["Quick take", "Standard brief", "Deep dive"],
          },
        ]}
        tips="Tip: the assistant flags anything that needs human verification under “Verify”."
      />
    </AppShell>
  );
}
