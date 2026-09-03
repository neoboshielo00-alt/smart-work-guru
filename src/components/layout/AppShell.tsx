import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: "⌘" },
  { to: "/email", label: "Email Studio", icon: "✉" },
  { to: "/notes", label: "Meeting Notes", icon: "☰" },
  { to: "/planner", label: "Task Planner", icon: "✦" },
  { to: "/research", label: "Research", icon: "✎" },
  { to: "/chat", label: "AI Chat", icon: "💬" },
] as const;

export function Disclaimer() {
  return (
    <p className="text-[11px] font-mono-term text-muted-foreground border border-border rounded-lg px-3 py-2 bg-panel">
      ⚠ AI-generated content may require human review before use.
    </p>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-sidebar-border bg-sidebar sticky top-0 h-screen p-5">
        <Link to="/" className="flex items-center gap-3">
          <span className="size-9 rounded-lg bg-primary grid place-items-center text-primary-foreground font-display font-bold text-lg glow-neon">
            W
          </span>
          <div>
            <p className="font-display font-bold text-sm leading-tight">Workflow</p>
            <p className="text-[10px] font-mono-term text-neon uppercase tracking-widest">
              AI Assistant
            </p>
          </div>
        </Link>

        <nav className="mt-8 space-y-1 flex-1">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-semibold hover-glow ${
                  active
                    ? "border-neon bg-sidebar-accent text-neon glow-neon"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="panel-neon p-3">
            <p className="text-[10px] font-mono-term text-neon uppercase tracking-widest">
              Pro plan
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-2/3 bg-neon rounded-full glow-neon" />
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">1,240 / 2,000 credits</p>
          </div>
          <div className="flex items-center gap-3 px-1">
            <span className="size-8 rounded-full bg-accent border border-neon grid place-items-center text-xs font-bold text-neon">
              AK
            </span>
            <div>
              <p className="text-xs font-bold">Ava Kim</p>
              <p className="text-[10px] text-muted-foreground">Product Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden sticky top-0 z-20 bg-sidebar/95 backdrop-blur border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Link to="/" className="flex items-center gap-2 mr-2 shrink-0">
            <span className="size-7 rounded-md bg-primary grid place-items-center text-primary-foreground font-display font-bold text-sm glow-neon">
              W
            </span>
          </Link>
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  active
                    ? "border-neon text-neon glow-neon"
                    : "border-border text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">{children}</main>
    </div>
  );
}
