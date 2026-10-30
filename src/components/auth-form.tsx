"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// hint shows under the box before anyone types, like the password rule.
type Field = { name: string; label: string; type: "email" | "password"; autoComplete: string; hint?: string };

type Props = {
  endpoint: string;
  fields: Field[];
  submit: string;
  busyText: string;
  // Sent along with the typed fields, like the reset token.
  extra?: Record<string, string>;
  // Where to go on success. Without it, the success message stays on the page.
  goTo?: string;
};

export function AuthForm({ endpoint, fields, submit, busyText, extra, goTo }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, ...extra }),
      });
      const body = await response.json();
      if (!response.ok) setError(body.error ?? "Something went wrong.");
      else if (goTo) {
        router.push(goTo);
        router.refresh();
      } else setMessage(body.message ?? "Done.");
    } catch {
      setError("Stubby didn't answer. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={send} className="flex max-w-md flex-col gap-4">
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1.5 font-semibold">
          {field.label}
          <input
            name={field.name}
            type={field.type}
            required
            autoComplete={field.autoComplete}
            value={values[field.name] ?? ""}
            onChange={(event) => setValues({ ...values, [field.name]: event.target.value })}
            className="rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-mono text-base font-normal outline-none focus:shadow-[4px_4px_0_var(--color-ink)]"
          />
          {field.hint && <span className="text-sm font-normal text-muted">{field.hint}</span>}
        </label>
      ))}
      <button
        type="submit"
        disabled={busy}
        className="mt-2 rounded-2xl border-[3px] border-ink bg-tomato px-7 py-3 text-lg font-bold text-ink shadow-[4px_4px_0_var(--color-ink)] transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {busy ? busyText : submit}
      </button>
      {error && (
        <p role="alert" className="rounded-2xl border-[3px] border-ink bg-white px-5 py-3 font-medium">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="rounded-2xl border-[3px] border-ink bg-butter px-5 py-3 font-medium">
          {message}
        </p>
      )}
    </form>
  );
}
