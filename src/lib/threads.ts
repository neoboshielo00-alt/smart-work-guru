import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "workflow.chat.threads.v1";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function loadThreads(): Thread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.updatedAt - a.updatedAt) : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(threads));
}

export function newThreadId() {
  return isBrowser() && window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : Math.random().toString(36).slice(2, 12);
}

export function createThread(): Thread {
  return { id: newThreadId(), title: "New conversation", updatedAt: Date.now(), messages: [] };
}

export function upsertThread(thread: Thread): Thread[] {
  const rest = loadThreads().filter((t) => t.id !== thread.id);
  const next = [thread, ...rest].sort((a, b) => b.updatedAt - a.updatedAt);
  saveThreads(next);
  return next;
}

export function deleteThread(id: string): Thread[] {
  const next = loadThreads().filter((t) => t.id !== id);
  saveThreads(next);
  return next;
}

export function firstThread(): Thread {
  const existing = loadThreads();
  const found = existing[0];
  if (found) return found;
  const created = createThread();
  upsertThread(created);
  return created;
}

export function titleFrom(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New conversation";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  if (!text) return "New conversation";
  return text.length > 42 ? `${text.slice(0, 42)}…` : text;
}
