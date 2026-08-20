import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/abonnement")({
  head: () => ({
    meta: [
      { title: "Abonnement — VSTR" },
      { name: "description", content: "Choisissez votre abonnement VSTR : 3 € par mois ou 30 € par an." },
      { property: "og:title", content: "Abonnement — VSTR" },
      { property: "og:description", content: "Choisissez votre abonnement VSTR : 3 € par mois ou 30 € par an." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

const PLAN_FEATURES = [
  "Réductions permanentes dans toutes les boutiques partenaires",
  "Offres uniques et exclusives en centre-ville",
  "Carte VSTR digitale et physique",
  "Accès au réseau de commerçants indépendants",
  "Sans engagement, résiliation à tout moment",
];

function PricingPage() {
  const [period, setPeriod] = useState<"monthly" | "annual">("annual");

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12">
          <Link to="/" className="text-xl font-black tracking-[0.18em]">
            VSTR
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            RETOUR
          </Link>
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-2xl">
          <div className="mb-14 text-center">
            <p className="text-[10px] tracking-[0.4em] text-foreground/40">L'ABONNEMENT VSTR</p>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
              Choisissez votre rythme.
            </h1>
            <p className="mt-6 text-base text-foreground/60 md:text-lg">
              Un seul abonnement, un accès illimité à votre centre-ville.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 border border-border/40 p-1">
              <button
                type="button"
                onClick={() => setPeriod("monthly")}
                className={`px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] transition-all ${
                  period === "monthly"
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                MENSUEL
              </button>
              <button
                type="button"
                onClick={() => setPeriod("annual")}
                className={`px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] transition-all ${
                  period === "annual"
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                ANNUEL
              </button>
            </div>
          </div>

          <div className="mt-10 border border-border/40 bg-secondary p-8 md:p-12">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-foreground/40">VSTR PASS</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">
                  {period === "monthly" ? "3 € / mois" : "30 € / an"}
                </h2>
              </div>
              {period === "annual" && (
                <span className="border border-foreground/20 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-foreground/70">
                  ÉCONOMISEZ 6 €
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-foreground/60">
              Accès complet au réseau VSTR, réductions en caisse, offres exclusives et carte membre.
            </p>

            <ul className="mt-8 space-y-4 border-t border-border/40 pt-8">
              {PLAN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span className="text-sm font-medium tracking-wide text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mt-10 w-full bg-foreground px-8 py-5 text-xs font-bold tracking-[0.2em] text-background transition-opacity hover:opacity-80"
            >
              {period === "monthly" ? "COMMENCER À 3 € / MOIS" : "COMMENCER À 30 € / AN"}
            </button>

            <p className="mt-4 text-center text-[10px] tracking-[0.15em] text-foreground/40">
              Paiement sécurisé. Sans engagement. Annulation à tout moment.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-6 text-[10px] tracking-[0.3em] text-foreground/40 md:flex-row md:px-12">
          <span>VSTR — BARBÂTRE</span>
          <span>PRINTEMPS / ÉTÉ 2026</span>
        </div>
      </footer>
    </div>
  );
}
