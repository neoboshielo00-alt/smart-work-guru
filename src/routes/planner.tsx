import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ToolWorkbench } from "@/components/ToolWorkbench";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workflow AI Assistant" },
      {
        name: "description",
        content:
          "Turn a messy task dump into a prioritized, time-blocked plan ranked by impact and urgency.",
      },
      { property: "og:title", content: "AI Task Planner — Workflow AI Assistant" },
      {
        property: "og:description",
        content: "Prioritize and time-block your day with an AI chief of staff.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell>
      <ToolWorkbench
        tool="planner"
        icon="✦"
        title="AI Task Planner"
        subtitle="prioritization + scheduling"
        inputLabel="Dump every task on your plate"
        placeholder="List tasks, meetings and deadlines — one per line…"
        sample={`- Finish Q3 board deck (due Friday)
- 1:1 with Ravi at 11:00
- Review 3 pull requests
- Reply to 14 unread client emails
- Draft hiring plan for Q4
- Team standup 09:30
- Renew SOC2 vendor questionnaire (due end of month)`}
        cta="Build my plan"
        loadingLabel="Prioritizing your day…"
        selects={[
          {
            key: "horizon",
            label: "Planning horizon",
            options: ["Today", "Tomorrow", "This week", "Next 2 weeks"],
          },
        ]}
        tips="Tip: include fixed meeting times so the schedule blocks around them."
      />
    </AppShell>
  );
}
