import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/supabase";
import AuthNavButton from "@/components/AuthNavButton";

export const Route = createFileRoute("/compte")({
  head: () => ({
    meta: [
      { title: "Mon compte — VSTR" },
      { name: "description", content: "Tableau de bord de votre compte VSTR." },
      { property: "og:title", content: "Mon compte — VSTR" },
      { property: "og:description", content: "Tableau de bord de votre compte VSTR." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ComptePage,
});

function ComptePage() {
  const navigate = useNavigate();
  const { session, loading, isAuthenticated } = useAuthSession();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/auth" });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen bg-background" />;
  }

  async function signOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const email = session?.user.email ?? "";

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12">
          <Link to="/" className="text-xl font-black tracking-[0.18em]">
            VSTR
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            <Link
              to="/boutiques"
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
            >
              Boutiques
            </Link>
            <Link
              to="/abonnement"
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
            >
              Abonnement
            </Link>
            <Link
              to="/contact"
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
            >
              Devenir partenaire
            </Link>
          </nav>
          <AuthNavButton />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-40 pb-32 md:px-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> RETOUR
        </Link>

        <p className="mt-10 text-xs tracking-[0.45em] text-foreground/60">ESPACE MEMBRE</p>
        <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
          Mon compte
        </h1>
        <p className="mt-6 text-sm text-foreground/60">
          Connecté en tant que{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>

        <section className="mt-14 border border-foreground/15 p-8 md:p-10">
          <p className="text-[10px] font-bold tracking-[0.25em] text-foreground/50">
            MON ABONNEMENT VSTR
          </p>
          <h2 className="mt-4 text-xl font-black uppercase tracking-[-0.02em]">
            Abonnement
          </h2>
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-foreground/10 pt-6">
            <span className="text-sm text-foreground/60">Statut</span>
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em]">
              <span className="h-2 w-2 rounded-full bg-foreground/35" aria-hidden="true" />
              Inactif
            </span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-foreground/50">
            Vous n&apos;avez pas encore d&apos;abonnement actif. Souscrivez pour débloquer les
            offres des boutiques partenaires.
          </p>
          <Link
            to="/abonnement"
            className="mt-8 inline-flex bg-foreground px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-80"
          >
            Voir les abonnements
          </Link>
        </section>

        <div className="mt-12 border-t border-foreground/10 pt-10">
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="inline-flex items-center gap-3 border border-foreground/25 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:border-foreground/50 hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
            {signingOut ? "Déconnexion…" : "Se déconnecter"}
          </button>
        </div>
      </main>

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-6 text-[10px] tracking-[0.3em] text-foreground/40 md:flex-row md:px-12">
          <span>VSTR — NANTES</span>
          <span>PRINTEMPS / ÉTÉ 2026</span>
        </div>
      </footer>
    </div>
  );
}
