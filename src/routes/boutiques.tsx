import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { ArrowLeft, Lock } from "lucide-react";

const BoutiquesMap = lazy(() => import("@/components/BoutiquesMap"));

export const Route = createFileRoute("/boutiques")({
  head: () => ({
    meta: [
      { title: "Boutiques partenaires à Nantes — VSTR" },
      {
        name: "description",
        content:
          "Découvrez les boutiques de vêtements partenaires VSTR au cœur du centre-ville de Nantes et débloquez leurs offres exclusives.",
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

const SHOPS = [
  { name: "Studio 44", lat: 47.2159, lng: -1.5589, area: "Rue Crébillon", offer: "-20 % sur toute la collection" },
  { name: "L'Atelier Nantais", lat: 47.2138, lng: -1.5551, area: "Quartier Bouffay", offer: "1 article offert pour 1 acheté" },
  { name: "Maison Loire", lat: 47.2172, lng: -1.5528, area: "Rue de la Paix", offer: "-15 % dès 60 € d'achat" },
  { name: "Bureau Graslin", lat: 47.2126, lng: -1.5602, area: "Place Graslin", offer: "-25 % sur le denim" },
  { name: "Nord / Sud", lat: 47.2185, lng: -1.5567, area: "Rue d'Orléans", offer: "-20 % permanent" },
  { name: "Atelier Sept", lat: 47.2143, lng: -1.5495, area: "Rue du Château", offer: "-15 % + retouches offertes" },
];

function BoutiquesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <a
              href="/#cta"
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
            >
              Devenir partenaire
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLoggedIn((v) => !v)}
              className="border border-foreground/25 px-2.5 py-1.5 text-[9px] tracking-[0.12em] text-foreground/50 transition-colors hover:text-foreground"
            >
              TOGGLE AUTH (DEV) · {isLoggedIn ? "ON" : "OFF"}
            </button>
            {isLoggedIn ? (
              <Link
                to="/abonnement"
                className="bg-foreground px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] text-background transition-opacity hover:opacity-80 md:text-xs"
              >
                MON COMPTE
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-foreground px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] text-background transition-opacity hover:opacity-80 md:text-xs"
              >
                S'INSCRIRE / SE CONNECTER
              </Link>
            )}
          </div>
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
          <ClientOnly fallback={<div className="h-full w-full bg-[#111111]" />}>
            <Suspense fallback={<div className="h-full w-full bg-[#111111]" />}>
              <BoutiquesMap shops={SHOPS} />
            </Suspense>
          </ClientOnly>
        </div>
      </section>

      {/* GRID */}
      <section className="pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <h2 className="text-[clamp(1.4rem,2.6vw,2.25rem)] font-black uppercase tracking-[-0.02em]">
            Offres en cours
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/60">
            Les réductions exactes sont réservées aux abonnés VSTR. Débloquez l'accès pour voir chaque
            offre en boutique.
          </p>

          <div className="mt-14 grid gap-px bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {SHOPS.map((shop) => (
              <article key={shop.name} className="flex flex-col bg-[#111111] p-8">
                <p className="text-[10px] tracking-[0.3em] text-foreground/45">
                  {shop.area.toUpperCase()}
                </p>
                <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.01em]">{shop.name}</h3>

                <div className="relative mt-8 flex h-28 items-center justify-center overflow-hidden bg-[#222222]">
                  <span
                    aria-hidden
                    className="select-none px-6 text-center text-lg font-black uppercase blur-[7px]"
                  >
                    {shop.offer}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                    <Lock className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                </div>

                <Link
                  to={isLoggedIn ? "/abonnement" : "/auth"}
                  className="mt-8 block bg-foreground px-6 py-4 text-center text-[10px] font-bold tracking-[0.18em] text-background transition-opacity hover:opacity-80"
                >
                  {isLoggedIn ? "VOIR LES ABONNEMENTS" : "S'ABONNER POUR VOIR L'OFFRE"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
