import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === "signup" ? ("signup" as const) : ("login" as const),
  }),
  head: () => ({
    meta: [
      { title: "Connexion / Inscription — VSTR" },
      {
        name: "description",
        content:
          "Connectez-vous ou créez votre compte VSTR pour débloquer les réductions permanentes des boutiques de votre centre-ville.",
      },
      { property: "og:title", content: "Connexion / Inscription — VSTR" },
      {
        property: "og:description",
        content: "Accédez à votre abonnement VSTR et aux offres des commerçants partenaires.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => setIsSignup(mode === "signup"), [mode]);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/abonnement" });
  }, [loading, session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/abonnement` },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Compte créé. Vérifiez votre boîte mail pour confirmer.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/abonnement" });
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return toast.error("Connexion Google impossible.");
    if (result.redirected) return;
    navigate({ to: "/abonnement" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-20 items-center px-6 md:px-12">
        <Link to="/" className="text-xl font-black tracking-[0.18em]">
          VSTR
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-[clamp(1.8rem,4vw,2.8rem)] font-black uppercase leading-[1] tracking-[-0.02em]">
            {isSignup ? "Créer mon compte" : "Se connecter"}
          </h1>
          <p className="mt-4 text-sm text-foreground/60">
            {isSignup
              ? "Rejoignez le mouvement VSTR et débloquez votre centre-ville."
              : "Accédez à votre abonnement et aux offres partenaires."}
          </p>

          <form onSubmit={submit} className="mt-10 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              className="w-full border border-border/60 bg-transparent px-4 py-4 text-xs tracking-[0.15em] outline-none placeholder:text-foreground/40 focus:border-foreground"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="MOT DE PASSE"
              className="w-full border border-border/60 bg-transparent px-4 py-4 text-xs tracking-[0.15em] outline-none placeholder:text-foreground/40 focus:border-foreground"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-foreground px-8 py-5 text-xs font-bold tracking-[0.2em] text-background transition-opacity hover:opacity-80 disabled:opacity-50"
            >
              {busy ? "..." : isSignup ? "CRÉER MON COMPTE" : "SE CONNECTER"}
            </button>
          </form>

          <button
            onClick={google}
            className="mt-4 w-full border border-border/60 px-8 py-5 text-xs font-bold tracking-[0.2em] transition-colors hover:border-foreground"
          >
            CONTINUER AVEC GOOGLE
          </button>

          <button
            onClick={() =>
              navigate({ to: "/auth", search: { mode: isSignup ? "login" : "signup" } })
            }
            className="mt-10 text-[10px] tracking-[0.25em] text-foreground/50 underline underline-offset-4 hover:text-foreground"
          >
            {isSignup ? "J'AI DÉJÀ UN COMPTE" : "CRÉER UN COMPTE"}
          </button>
        </div>
      </main>
    </div>
  );
}
