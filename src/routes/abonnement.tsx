import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/abonnement")({
  head: () => ({
    meta: [
      { title: "Abonnement VSTR — Débloquez votre centre-ville" },
      {
        name: "description",
        content:
          "Choisissez votre abonnement VSTR : réductions permanentes et offres exclusives dans toutes les boutiques partenaires de votre centre-ville.",
      },
      { property: "og:title", content: "Abonnement VSTR" },
      {
        property: "og:description",
        content: "Un abonnement mensuel clair, sans engagement, pour économiser en centre-ville.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AbonnementPage,
});

const PLANS = [
  {
    name: "VSTR ESSENTIEL",
    price: "6,90 €",
    features: ["Réductions permanentes -10 %", "Carte des boutiques partenaires", "Sans engagement"],
  },
  {
    name: "VSTR ORIGIN",
    price: "12,90 €",
    features: [
      "Réductions permanentes jusqu'à -20 %",
      "Offres uniques (1 acheté = 1 offert)",
      "Accès anticipé aux nouveautés partenaires",
    ],
  },
];

function AbonnementPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      void navigate({ to: "/auth", search: { mode: "signup" } });
    }
  }, [loading, session, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex h-20 items-center justify-between px-6 md:px-12">
        <Link to="/" className="text-xl font-black tracking-[0.18em]">
          VSTR
        </Link>
        {session && (
          <button
            onClick={() => void supabase.auth.signOut()}
            className="text-[10px] tracking-[0.25em] text-foreground/50 hover:text-foreground"
          >
            SE DÉCONNECTER
          </button>
        )}
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-20 md:px-12 md:py-32">
        <p className="text-[10px] tracking-[0.4em] text-foreground/40">ABONNEMENT</p>
        <h1 className="mt-8 max-w-3xl text-[clamp(1.9rem,4.5vw,3.6rem)] font-black uppercase leading-[1] tracking-[-0.03em]">
          Choisissez votre formule VSTR.
        </h1>

        <div className="mt-20 grid gap-px bg-border/40 md:grid-cols-2">
          {PLANS.map((plan) => (
            <div key={plan.name} className="bg-background p-10 md:p-12">
              <h2 className="text-lg font-black uppercase tracking-tight">{plan.name}</h2>
              <p className="mt-6 text-4xl font-black tracking-[-0.03em]">
                {plan.price}
                <span className="ml-2 text-xs font-bold tracking-[0.2em] text-foreground/50">
                  / MOIS
                </span>
              </p>
              <ul className="mt-8 space-y-3 text-sm text-foreground/60">
                {plan.features.map((f) => (
                  <li key={f}>— {f}</li>
                ))}
              </ul>
              <button className="mt-10 w-full bg-foreground px-8 py-5 text-xs font-bold tracking-[0.2em] text-background transition-opacity hover:opacity-80">
                CHOISIR CETTE FORMULE
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
