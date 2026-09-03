import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import { runAiTool } from "@/lib/ai.functions";
import { Disclaimer } from "@/components/layout/AppShell";

type SelectDef = { key: string; label: string; options: string[] };

export function ToolWorkbench({
  tool,
  icon,
  title,
  subtitle,
  inputLabel,
  placeholder,
  sample,
  cta,
  loadingLabel,
  selects = [],
  tips,
}: {
  tool: "email" | "notes" | "planner" | "research";
  icon: string;
  title: string;
  subtitle: string;
  inputLabel: string;
  placeholder: string;
  sample: string;
  cta: string;
  loadingLabel: string;
  selects?: SelectDef[];
  tips: string;
}) {
  const run = useServerFn(runAiTool);
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(selects.map((s) => [s.key, s.options[0] ?? ""])),
  );
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    const value = input.trim();
    if (!value || loading) return;
    setLoading(true);
    setError(null);
    setOutput(null);
    try {
      const res = await run({ data: { tool, input: value, options } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!output) return;
    void navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <span className="size-10 rounded-lg border border-neon bg-panel grid place-items-center text-lg text-neon glow-neon">
          {icon}
        </span>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
          <p className="text-xs font-mono-term text-neon uppercase tracking-widest">{subtitle}</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-5 items-start">
        {/* Input card */}
        <div className="panel-neon p-5 space-y-4">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {inputLabel}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={tool === "notes" || tool === "planner" ? 9 : 6}
            className="w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:glow-neon resize-y"
          />
          <button
            type="button"
            onClick={() => setInput(sample)}
            className="text-[11px] font-mono-term text-neon underline-offset-2 hover:underline"
          >
            ↳ Load an example
          </button>

          {selects.map((sel) => (
            <div key={sel.key} className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {sel.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {sel.options.map((opt) => {
                  const active = options[sel.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOptions((o) => ({ ...o, [sel.key]: opt }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold hover-glow ${
                        active
                          ? "border-neon bg-primary text-primary-foreground glow-neon"
                          : "border-border bg-panel text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => void generate()}
            disabled={!input.trim() || loading}
            className="w-full rounded-lg bg-primary text-primary-foreground font-bold text-sm py-3 glow-neon hover:glow-neon-strong transition-shadow disabled:opacity-40 disabled:shadow-none"
          >
            {loading ? loadingLabel : cta}
          </button>
          <p className="text-[11px] text-muted-foreground">{tips}</p>
        </div>

        {/* Output card */}
        <div className="panel-neon p-5 min-h-[320px]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AI Output
            </p>
            {output ? (
              <button
                type="button"
                onClick={copy}
                className="rounded-md border border-border px-2.5 py-1 text-[11px] font-mono-term text-neon hover-glow"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            ) : null}
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-2.5">
                <span className="size-4 rounded-full conic-loader" />
                <p className="text-sm font-semibold text-neon">{loadingLabel}</p>
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded bg-muted animate-pulse w-full" />
                <div className="h-3 rounded bg-muted animate-pulse w-5/6" />
                <div className="h-3 rounded bg-muted animate-pulse w-4/6" />
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3.5 text-sm font-semibold text-destructive">
              {error}
            </div>
          ) : output ? (
            <div className="rise text-sm">
              <MessageResponse>{output}</MessageResponse>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="font-mono-term text-2xl text-neon/50">▸_</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your result will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
