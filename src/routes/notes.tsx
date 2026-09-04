import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workflow AI Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary with key points, decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workflow AI Assistant" },
      {
        property: "og:description",
        content: "Extract key points, decisions, owners and deadlines from any meeting transcript.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell>
      <ToolWorkbench
        tool="notes"
        icon="☰"
        title="Meeting Notes Summarizer"
        subtitle="key points · decisions · action items"
        inputLabel="Paste your raw notes or transcript"
        placeholder="Paste meeting notes, bullet points or a transcript…"
        sample={`Weekly product sync — attendees: Ava, Ravi, Lena, Tom
- Ravi: onboarding funnel drop-off at step 3, ~28% churn
- Lena proposes shortening form to 4 fields, needs design by Thursday
- Tom: billing migration blocked on vendor sandbox access
- Decision: ship shortened form behind a flag next sprint
- Ava to email vendor about sandbox creds today
- Open question: do we backfill legacy accounts?`}
        cta="Summarize notes"
        loadingLabel="Summarizing your meeting…"
        tips="Tip: keep speaker names in the text so owners can be attributed accurately."
      />
    </AppShell>
  );
}
