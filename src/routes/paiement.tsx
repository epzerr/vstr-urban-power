import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/paiement")({
  head: () => ({
    meta: [
      { title: "Paiement — VSTR" },
      { name: "description", content: "Finalisez votre abonnement VSTR en toute sécurité." },
      { property: "og:title", content: "Paiement — VSTR" },
      { property: "og:description", content: "Finalisez votre abonnement VSTR en toute sécurité." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const search = useSearch({ from: "/paiement" }) as { period?: "monthly" | "annual" };
  const period = search.period === "monthly" ? "monthly" : "annual";

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const plan = period === "monthly" ? { label: "3 € / mois", amount: "3 €", period: "mensuel" } : { label: "30 € / an", amount: "30 €", period: "annuel" };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12">
          <Link to="/" className="text-xl font-black tracking-[0.18em]">
            VSTR
          </Link>
          <Link
            to="/abonnement"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            RETOUR
          </Link>
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center px-6 pt-28 pb-16">
        <div className="w-full max-w-xl">
          <div className="mb-12 text-center">
            <p className="text-[10px] tracking-[0.4em] text-foreground/40">PAIEMENT SÉCURISÉ</p>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
              Finalisez votre abonnement.
            </h1>
            <p className="mt-6 text-base text-foreground/60 md:text-lg">
              Entrez vos informations. Le vrai traitement sera connecté à Stripe plus tard.
            </p>
          </div>

          <div className="border border-border/40 bg-secondary p-8 md:p-12">
            <div className="flex items-center justify-between border-b border-border/40 pb-6">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-foreground/40">VSTR PASS</p>
                <h2 className="mt-2 text-2xl font-black uppercase tracking-tight md:text-3xl">{plan.label}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.15em] text-foreground/40">TOTAL AUJOURD'HUI</p>
                <p className="mt-1 text-2xl font-black tracking-tight">{plan.amount}</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-foreground/70">
                  E-MAIL
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full border border-border/40 bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="name" className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-foreground/70">
                  NOM SUR LA CARTE
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prénom NOM"
                  className="w-full border border-border/40 bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold tracking-[0.15em] text-foreground/70">
                  COORDONNÉES DE CARTE
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full border border-border/40 bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none"
                  />
                  <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30" strokeWidth={1.5} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / AA"
                    className="w-full border border-border/40 bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    className="w-full border border-border/40 bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:border-foreground/40 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full bg-foreground px-8 py-5 text-xs font-bold tracking-[0.2em] text-background transition-opacity hover:opacity-80"
              >
                PAYER {plan.amount} {plan.period === "mensuel" ? "/ MOIS" : "/ AN"}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] tracking-[0.15em] text-foreground/40">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
              <span>Paiement sécurisé par Stripe (à connecter)</span>
            </div>
          </div>
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
