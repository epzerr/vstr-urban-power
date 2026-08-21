import { createFileRoute, Link } from "@tanstack/react-router";
import { UserPlus, MapPin, PiggyBank, Percent, Gift, Store } from "lucide-react";
import heroImg from "@/assets/vstr-hero.jpg";
import cityImg from "@/assets/vstr-city.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VSTR — L'abonnement qui redéfinit votre pouvoir d'achat urbain" },
      {
        name: "description",
        content:
          "VSTR : l'abonnement intelligent qui débloque des réductions permanentes dans les boutiques de centre-ville et soutient le commerce local.",
      },
      { property: "og:title", content: "VSTR — Votre pouvoir d'achat urbain redéfini" },
      {
        property: "og:description",
        content:
          "Réductions permanentes et offres uniques dans chaque boutique partenaire de votre centre-ville.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = ["Boutiques", "Abonnement", "Devenir partenaire"];

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <header className="fixed inset-x-0 top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 md:px-12">
          <a href="#" className="text-xl font-black tracking-[0.18em]">
            VSTR
          </a>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((item) =>
              item === "Boutiques" ? (
                <Link
                  key={item}
                  to="/boutiques"
                  className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              ) : item === "Abonnement" ? (
                <Link
                  key={item}
                  to="/abonnement"
                  className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              ) : (
                <Link
                  key={item}
                  to="/contact"
                  className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              )
            )}
          </nav>
          <Link
            to="/auth"
            className="bg-foreground px-5 py-2.5 text-[10px] font-bold tracking-[0.15em] text-background transition-opacity hover:opacity-80 md:text-xs"
          >
            S'INSCRIRE / SE CONNECTER
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16">
        <div className="mx-auto grid w-full max-w-[1600px] items-center gap-12 px-6 md:grid-cols-[1.05fr_0.95fr] md:px-12">
          <div className="order-2 md:order-1">
            <p className="text-xs tracking-[0.45em] text-foreground/60">
              PRINTEMPS / ÉTÉ 2026
            </p>
            <h1 className="mt-8 text-[clamp(2.4rem,6vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
              VSTR : votre pouvoir d'achat urbain redéfini
            </h1>
            <div className="mt-12">
              <Link
                to="/abonnement"
                className="inline-block bg-foreground px-10 py-5 text-xs font-bold tracking-[0.2em] text-background transition-opacity hover:opacity-80"
              >
                DÉBLOQUER MON CENTRE-VILLE AVEC VSTR
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 md:translate-y-10">
            <img
              src={heroImg}
              alt="Mannequin urbain vêtu de noir tenant un téléphone et un sac VSTR"
              width={1024}
              height={1408}
              className="h-[52vh] w-full object-cover object-top md:h-[80vh]"
            />
          </div>
        </div>
        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] text-foreground/40">
          SCROLL
        </span>
      </section>

      {/* PROBLÈME */}
      <section className="border-t border-border/40 py-28 md:py-40">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-[10px] tracking-[0.4em] text-foreground/40">01 — LE CONSTAT</p>
          <h2 className="mt-8 text-[clamp(1.7rem,3.4vw,3rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
            Le coût de la vie en centre-ville grignote votre pouvoir d'achat et étouffe le commerce
            local.
          </h2>
          <p className="mt-10 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Chaque mois, les prix montent et le panier se resserre. Les habitants renoncent aux
            boutiques de proximité, les rideaux se baissent un à un, et le trafic file vers les
            zones commerciales périphériques. La désertification commerciale n'est pas une
            fatalité économique : c'est un manque d'incitation.
          </p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-28 md:py-40">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] md:px-12">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-foreground/40">02 — LA RÉPONSE</p>
            <h2 className="mt-8 text-[clamp(1.7rem,3.4vw,3rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
              Notre solution : VSTR, l'abonnement intelligent pour soutenir votre ville et
              économiser.
            </h2>
          </div>
          <p className="self-end text-base leading-relaxed text-foreground/70 md:text-lg">
            VSTR est l'abonnement unique qui débloque un accès permanent à des réductions fortes
            et des offres exclusives dans chaque boutique de centre-ville partenaire. Un seul
            geste, une carte, un réseau entier de commerçants indépendants. Vous dépensez moins,
            votre ville vit plus.
          </p>
        </div>
      </section>

      {/* COMMENT ÇA FONCTIONNE */}
      <section className="bg-secondary py-28 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <h2 className="max-w-3xl text-[clamp(1.7rem,3.4vw,3rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
            Comment ça fonctionne : votre centre-ville en 3 étapes simples.
          </h2>
          <div className="mt-20 grid gap-px bg-border/40 md:grid-cols-3">
            {[
              { icon: UserPlus, title: "1. S'abonner à VSTR.", text: "Un abonnement mensuel clair, sans engagement, activé en deux minutes." },
              { icon: MapPin, title: "2. Découvrir les boutiques.", text: "La carte des commerçants partenaires de votre centre-ville, toujours à jour." },
              { icon: PiggyBank, title: "3. Économiser et soutenir.", text: "Vous présentez VSTR en caisse. La remise s'applique, le commerce local gagne." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-secondary p-10 md:p-12">
                <Icon className="h-7 w-7" strokeWidth={1.25} />
                <h3 className="mt-8 text-lg font-black uppercase tracking-tight">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÉNÉFICES */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-[clamp(1.7rem,3.4vw,3rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
            Bénéfices concrets : pouvoir d'achat accru et commerce local soutenu.
          </h2>
          <ul className="mt-16 divide-y divide-border/40 border-y border-border/40">
            {[
              { icon: Percent, text: "Pour vous : réductions permanentes (-15 %, -20 %)" },
              { icon: Gift, text: "Pour vous : offres uniques fortes (ex : un article offert pour un acheté)" },
              { icon: Store, text: "Pour les boutiques : nouveaux clients et fidélisation" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-6 py-8">
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-bold uppercase tracking-[0.08em] md:text-base">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* QUI SOMMES-NOUS */}
      <section className="bg-secondary py-28 md:py-40">
        <div className="mx-auto grid max-w-[1600px] items-center gap-14 px-6 md:grid-cols-2 md:px-12">
          <div>
            <h2 className="text-[clamp(1.7rem,3.4vw,3rem)] font-black uppercase leading-[1.02] tracking-[-0.02em]">
              Qui sommes-nous : VSTR Origin, born in the city, for the city.
            </h2>
            <p className="mt-10 text-base leading-relaxed text-foreground/70 md:text-lg">
              VSTR est né à Nantes, entre les vitrines d'artisans et les rues qui se vident hors
              saison. Nous avons grandi avec ces commerces : le torréfacteur, la boutique de prêt-à-porter,
              le disquaire. Notre vision est simple et têtue — rendre le centre-ville plus
              avantageux que la périphérie, pour ceux qui y vivent comme pour ceux qui y travaillent.
            </p>
          </div>
          <img
            src={cityImg}
            alt="Utilisateur VSTR faisant ses achats dans une rue commerçante de centre-ville"
            width={1408}
            height={1024}
            loading="lazy"
            className="h-[46vh] w-full object-cover md:h-[70vh]"
          />
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="flex min-h-[80vh] items-center py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
            Votre prochaine étape est ici.
          </h2>
          <div className="mt-14">
            <Link
              to="/abonnement"
              className="inline-block bg-foreground px-12 py-6 text-xs font-bold tracking-[0.2em] text-background transition-opacity hover:opacity-80 md:text-sm"
            >
              REJOINDRE LE MOUVEMENT VSTR MAINTENANT
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-6 text-[10px] tracking-[0.3em] text-foreground/40 md:flex-row md:px-12">
          <span>VSTR — NANTES</span>
          <span>PRINTEMPS / ÉTÉ 2026</span>
        </div>
      </footer>
    </div>
  );
}
