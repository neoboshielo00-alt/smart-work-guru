import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Studio — Workflow AI Assistant" },
      {
        name: "description",
        content:
          "Generate professional, ready-to-send business emails with tone and audience controls.",
      },
      { property: "og:title", content: "Email Studio — Workflow AI Assistant" },
      {
        property: "og:description",
        content: "Draft polished business emails in seconds with tone and audience controls.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell>
      <ToolWorkbench
        tool="email"
        icon="✉"
        title="Smart Email Generator"
        subtitle="tone + audience aware drafting"
        inputLabel="What should this email say?"
        placeholder="e.g. Ask the vendor for an updated quote and confirm the delivery date…"
        sample="Follow up with the client about the delayed Q3 report, apologize for the slip, and propose a new delivery date next Wednesday."
        cta="Generate email"
        loadingLabel="Drafting your email…"
        selects={[
          {
            key: "tone",
            label: "Tone",
            options: ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic"],
          },
          {
            key: "audience",
            label: "Audience",
            options: ["Client", "Manager", "Teammate", "Vendor", "Executive"],
          },
        ]}
        tips="Tip: include names, dates and the outcome you want — the more context, the sharper the draft."
      />
    </AppShell>
  );
}
