import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/supabase";
import type { BoutiquePublic } from "@/components/BoutiquesMap";
import AuthNavButton from "@/components/AuthNavButton";

const BoutiquesMap = lazy(() => import("@/components/BoutiquesMap"));

export const Route = createFileRoute("/boutiques")({
  head: () => ({
    meta: [
      { title: "Boutiques partenaires à Nantes — VSTR" },
      {
        name: "description",
        content:
          "Découvrez les boutiques de vêtements partenaires VSTR au cœur du centre-ville de Nantes et leurs offres exclusives.",
      },
      { property: "og:title", content: "Boutiques partenaires à Nantes — VSTR" },
      {
        property: "og:description",
        content:
          "Carte des boutiques indépendantes partenaires VSTR à Nantes et offres réservées aux abonnés.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BoutiquesPage,
});

function BoutiquesPage() {
  const [shops, setShops] = useState<BoutiquePublic[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadBoutiques() {
      const { data, error } = await supabase
        .from("boutiques")
        .select("*")
        .eq("active", true);

      if (cancelled) return;
      if (error) {
        console.error("[boutiques]", error.message);
        setShops([]);
        return;
      }
      setShops((data ?? []) as BoutiquePublic[]);
    }

    void loadBoutiques();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="fixed inset-x-0 top-0 z-[60] bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12">
          <Link to="/" className="text-xl font-black tracking-[0.18em]">
            VSTR
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            <Link to="/boutiques" className="text-sm tracking-wide text-foreground">
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

      {/* MAP */}
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> RETOUR
          </Link>
          <p className="mt-10 text-xs tracking-[0.45em] text-foreground/60">NANTES · CENTRE-VILLE</p>
          <h1 className="mt-6 max-w-4xl text-[clamp(2rem,5vw,4.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
            Les boutiques partenaires VSTR
          </h1>

          <div className="mt-12 h-[380px] w-full overflow-hidden border border-foreground/10 md:h-[480px]">
            {typeof window !== "undefined" ? (
              <Suspense fallback={<div className="h-full w-full bg-[#111111]" />}>
                <BoutiquesMap shops={shops} />
              </Suspense>
            ) : (
              <div className="h-full w-full bg-[#111111]" />
            )}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <h2 className="text-[clamp(1.4rem,2.6vw,2.25rem)] font-black uppercase tracking-[-0.02em]">
            Offres en cours
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/60">
            Les offres des boutiques partenaires VSTR sont affichées ci-dessous. Abonnez-vous pour
            débloquer l'utilisation des réductions en boutique.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {shops.map((shop) => (
              <article
                key={shop.id}
                id={`boutique-${shop.id}`}
                className="flex w-full max-w-xl flex-col border border-foreground/10 bg-[#111111] p-8 sm:max-w-none scroll-mt-28"
              >
                <p className="text-[10px] tracking-[0.3em] text-foreground/45">
                  {(shop.quartier || "").toUpperCase()}
                </p>
                <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.01em]">{shop.nom}</h3>
                {shop.adresse && (
                  <p className="mt-2 text-xs text-foreground/50">{shop.adresse}</p>
                )}

                <div className="mt-8 space-y-px">
                  {shop.offre_permanente && (
                    <div className="bg-[#222222] px-6 py-6 text-center">
                      <p className="text-[10px] tracking-[0.25em] text-foreground/45">
                        OFFRE PERMANENTE
                      </p>
                      <p className="mt-2 text-lg font-black uppercase">{shop.offre_permanente}</p>
                    </div>
                  )}
                  {shop.offre_unique && (
                    <div className="bg-[#222222] px-6 py-6 text-center">
                      <p className="text-[10px] tracking-[0.25em] text-foreground/45">
                        OFFRE UNIQUE · 1 UTILISATION
                      </p>
                      <p className="mt-2 text-lg font-black uppercase">{shop.offre_unique}</p>
                    </div>
                  )}
                </div>

                <Link
                  to="/abonnement"
                  className="mt-8 block bg-foreground px-6 py-4 text-center text-[10px] font-bold tracking-[0.18em] text-background transition-opacity hover:opacity-80"
                >
                  S'ABONNER POUR DÉBLOQUER
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
