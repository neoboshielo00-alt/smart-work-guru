import { useChat } from "@ai-sdk/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { AppShell, Disclaimer } from "@/components/layout/AppShell";
import {
  createThread,
  deleteThread,
  loadThreads,
  titleFrom,
  upsertThread,
  type Thread,
} from "@/lib/threads";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "AI Chat — Workflow AI Assistant" },
      {
        name: "description",
        content: "Chat with an AI workplace assistant across multiple saved conversation threads.",
      },
      { property: "og:title", content: "AI Chat — Workflow AI Assistant" },
      {
        property: "og:description",
        content: "A professional AI chat assistant with multiple saved conversation threads.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Summarize this week's priorities for a product lead",
  "Write a polite nudge to a client who hasn't replied",
  "Help me prepare an agenda for a 30-minute sync",
];

function ChatPage() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    const all = loadThreads();
    const found = all.find((t) => t.id === threadId);
    if (found) {
      setThreads(all);
      setInitial(found.messages);
    } else {
      const created: Thread = { ...createThread(), id: threadId };
      setThreads(upsertThread(created));
      setInitial([]);
    }
  }, [threadId]);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initial ?? [],
    transport,
    onError: (e) => setError(e.message || "The assistant is unavailable right now."),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!initial || messages.length === 0) return;
    setThreads(
      upsertThread({
        id: threadId,
        title: titleFrom(messages),
        updatedAt: Date.now(),
        messages,
      }),
    );
  }, [messages, threadId, initial]);

  function send(text: string) {
    const value = text.trim();
    if (!value || isLoading) return;
    setError(null);
    setInput("");
    void sendMessage({ text: value });
  }

  function startThread() {
    const created = createThread();
    setThreads(upsertThread(created));
    void navigate({ to: "/chat/$threadId", params: { threadId: created.id } });
  }

  function removeThread(id: string) {
    const next = deleteThread(id);
    setThreads(next);
    if (id === threadId) {
      const target = next[0];
      if (target) {
        void navigate({ to: "/chat/$threadId", params: { threadId: target.id } });
      } else {
        startThread();
      }
    }
  }

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[240px_1fr] gap-5 items-start">
        {/* Threads */}
        <aside className="panel-neon p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Conversations
            </p>
            <button
              type="button"
              onClick={startThread}
              className="rounded-md border border-neon px-2 py-0.5 text-[11px] font-mono-term text-neon hover-glow"
            >
              + New
            </button>
          </div>
          <div className="space-y-1.5 max-h-[40vh] lg:max-h-[60vh] overflow-y-auto">
            {threads.map((t) => (
              <div
                key={t.id}
                className={`group flex items-center gap-1 rounded-lg border px-2.5 py-2 hover-glow ${
                  t.id === threadId
                    ? "border-neon bg-accent text-neon glow-neon"
                    : "border-border text-muted-foreground"
                }`}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="flex-1 truncate text-xs font-semibold"
                >
                  {t.title}
                </Link>
                <button
                  type="button"
                  aria-label="Delete conversation"
                  onClick={() => removeThread(t.id)}
                  className="text-[11px] opacity-0 group-hover:opacity-100 hover:text-destructive"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <section className="panel-neon flex flex-col h-[70vh] min-h-[480px]">
          <div className="border-b border-border px-5 py-3">
            <h1 className="font-display text-lg font-bold">AI Chat</h1>
            <p className="text-[11px] font-mono-term text-neon uppercase tracking-widest">
              workplace assistant
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className="py-8 text-center space-y-4">
                <p className="font-mono-term text-2xl text-neon/50">▸_</p>
                <p className="text-sm text-muted-foreground">
                  Ask anything about your work — writing, meetings, planning or research.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover-glow hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-xl border px-4 py-3 text-sm rise ${
                        isUser
                          ? "border-neon bg-accent text-foreground"
                          : "border-border bg-background text-foreground"
                      }`}
                    >
                      {isUser ? text : <MessageResponse>{text}</MessageResponse>}
                    </div>
                  </div>
                );
              })
            )}

            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <span className="size-4 rounded-full conic-loader" />
                <p className="text-sm font-semibold text-neon">Thinking…</p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                {error}
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border p-3 flex items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              placeholder="Message the assistant…"
              className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground glow-neon hover:glow-neon-strong disabled:opacity-40 disabled:shadow-none"
            >
              Send
            </button>
          </form>
        </section>
      </div>

      <Disclaimer />
    </AppShell>
  );
}
