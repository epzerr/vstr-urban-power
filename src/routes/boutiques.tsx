import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listBoutiques } from "@/lib/boutiques.functions";

const BoutiquesMap = lazy(() => import("@/components/BoutiquesMap"));

export const Route = createFileRoute("/boutiques")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["boutiques"],
      queryFn: () => listBoutiques(),
    });
  },
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
  const [mapReady, setMapReady] = useState(false);
  const { data: shops = [] } = useQuery({
    queryKey: ["boutiques"],
    queryFn: () => listBoutiques(),
  });

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
          <Link
            to="/auth"
            className="bg-foreground px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] text-background transition-opacity hover:opacity-80 md:text-xs"
          >
            S'INSCRIRE / SE CONNECTER
          </Link>
        </div>
      </header>

      {/* MAP */}
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
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
        </div>

        <div className="mt-12 h-[420px] w-full border-y border-foreground/10 md:h-[560px]">
          {typeof window !== "undefined" && (
            <Suspense fallback={<div className="h-full w-full bg-[#111111]" />}>
              <BoutiquesMap shops={shops} />
            </Suspense>
          )}
          {typeof window === "undefined" && <div className="h-full w-full bg-[#111111]" />}
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

          <div className="mt-14 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <article key={shop.id} className="flex flex-col bg-[#111111] p-8">
                <p className="text-[10px] tracking-[0.3em] text-foreground/45">
                  {shop.area.toUpperCase()}
                </p>
                <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.01em]">{shop.name}</h3>
                {shop.address && (
                  <p className="mt-2 text-xs text-foreground/50">{shop.address}</p>
                )}

                <div className="mt-8 space-y-px">
                  {shop.permanent_offer && (
                    <div className="bg-[#222222] px-6 py-6 text-center">
                      <p className="text-[10px] tracking-[0.25em] text-foreground/45">
                        OFFRE PERMANENTE
                      </p>
                      <p className="mt-2 text-lg font-black uppercase">{shop.permanent_offer}</p>
                    </div>
                  )}
                  {shop.unique_offer && (
                    <div className="bg-[#222222] px-6 py-6 text-center">
                      <p className="text-[10px] tracking-[0.25em] text-foreground/45">
                        OFFRE UNIQUE · 1 UTILISATION
                      </p>
                      <p className="mt-2 text-lg font-black uppercase">{shop.unique_offer}</p>
                    </div>
                  )}
                  {!shop.permanent_offer && !shop.unique_offer && shop.offer && (
                    <div className="bg-[#222222] px-6 py-6 text-center">
                      <p className="text-lg font-black uppercase">{shop.offer}</p>
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
