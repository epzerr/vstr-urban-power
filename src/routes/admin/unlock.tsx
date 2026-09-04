import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { unlockAdmin } from "@/lib/admin-boutiques.functions";

export const Route = createFileRoute("/admin/unlock")({
  head: () => ({
    meta: [
      { title: "Admin VSTR — Accès" },
      { name: "description", content: "Accès réservé à l'administration VSTR." },
      { property: "og:title", content: "Admin VSTR — Accès" },
      { property: "og:description", content: "Accès réservé à l'administration VSTR." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Unlock,
});

function Unlock() {
  const router = useRouter();
  const unlock = useServerFn(unlockAdmin);
  const [error, setError] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = new FormData(e.currentTarget).get("password") as string;
    const { ok } = await unlock({ data: { password } });
    if (ok) await router.navigate({ to: "/admin/boutiques" });
    else setError(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-border/40 bg-card p-8"
      >
        <h1 className="text-xl font-black uppercase tracking-[0.1em]">Admin VSTR</h1>
        <p className="mt-2 text-xs text-foreground/60">Accès réservé.</p>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Mot de passe"
          className="mt-6 w-full border border-border/40 bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
        />
        {error && <p className="mt-3 text-xs text-destructive">Mot de passe incorrect.</p>}
        <button
          type="submit"
          className="mt-6 w-full bg-foreground py-3 text-xs font-bold uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-80"
        >
          Entrer
        </button>
      </form>
    </div>
  );
}
