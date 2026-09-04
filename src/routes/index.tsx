import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Disclaimer } from "@/components/layout/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workflow — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate daily work: draft emails, summarize meetings, plan tasks, run research briefs and chat with an AI assistant.",
      },
      { property: "og:title", content: "Workflow — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, summarize meetings, plan your day and research faster with one AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: "✉",
    title: "Smart Email Generator",
    desc: "Ready-to-send drafts tuned to tone and audience.",
    tag: "Writing",
  },
  {
    to: "/notes",
    icon: "☰",
    title: "Meeting Notes Summarizer",
    desc: "Key points, decisions, owners and deadlines.",
    tag: "Meetings",
  },
  {
    to: "/planner",
    icon: "✦",
    title: "AI Task Planner",
    desc: "Prioritized, time-blocked plans for your day.",
    tag: "Focus",
  },
  {
    to: "/research",
    icon: "✎",
    title: "AI Research Assistant",
    desc: "Structured briefs with insights and next steps.",
    tag: "Analysis",
  },
] as const;

const STATS = [
  { label: "Hours saved / week", value: "6.4" },
  { label: "Drafts generated", value: "128" },
  { label: "Meetings summarized", value: "37" },
  { label: "Avg. turnaround", value: "9s" },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <header className="rise">
        <p className="font-mono-term text-xs uppercase tracking-[0.25em] text-neon">
          ▸ workspace online
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-tight">
          AI Workplace Productivity Assistant
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Five AI tools for the work that eats your day — writing, meetings, planning, research
          and a chat assistant that keeps the context.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground glow-neon hover:glow-neon-strong transition-shadow"
          >
            Open AI Chat
          </Link>
          <Link
            to="/email"
            className="rounded-lg border border-neon bg-panel px-4 py-2.5 text-sm font-bold text-neon hover-glow"
          >
            Draft an email
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="panel-neon p-4">
            <p className="font-display text-2xl font-bold text-neon">{s.value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
          </div>
        ))}
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="panel-neon p-5 hover-glow block">
            <div className="flex items-start justify-between gap-3">
              <span className="size-10 rounded-lg border border-neon bg-background grid place-items-center text-lg text-neon">
                {t.icon}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-mono-term uppercase tracking-widest text-muted-foreground">
                {t.tag}
              </span>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold">{t.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-3 text-xs font-mono-term text-neon">Open ↗</p>
          </Link>
        ))}
      </section>

      <Disclaimer />
    </AppShell>
  );
}
