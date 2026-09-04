import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { firstThread } from "@/lib/threads";

export const Route = createFileRoute("/chat/")({
  head: () => ({
    meta: [
      { title: "AI Chat — Workflow AI Assistant" },
      {
        name: "description",
        content:
          "Chat with an AI workplace assistant across multiple saved conversation threads.",
      },
      { property: "og:title", content: "AI Chat — Workflow AI Assistant" },
      {
        property: "og:description",
        content: "A professional AI chat assistant with multiple saved conversation threads.",
      },
    ],
  }),
  component: ChatRedirect,
});

function ChatRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const thread = firstThread();
    void navigate({ to: "/chat/$threadId", params: { threadId: thread.id }, replace: true });
  }, [navigate]);

  return (
    <AppShell>
      <div className="panel-neon p-8 text-center">
        <span className="size-5 rounded-full conic-loader inline-block" />
        <p className="mt-3 text-sm text-muted-foreground">Opening your conversation…</p>
      </div>
    </AppShell>
  );
}
