import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion — VSTR" },
      { name: "description", content: "Connectez-vous ou créez votre compte VSTR." },
      { property: "og:title", content: "Connexion — VSTR" },
      { property: "og:description", content: "Connectez-vous ou créez votre compte VSTR." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
              {mode === "login" ? "Se connecter" : "S'inscrire"}
            </h1>
            <p className="mt-4 text-sm text-foreground/60">
              {mode === "login"
                ? "Accédez à votre espace VSTR."
                : "Rejoignez le mouvement VSTR en quelques secondes."}
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {mode === "register" && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-bold tracking-[0.2em] text-foreground/70">
                  PRÉNOM
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Votre prénom"
                  className="w-full border-b border-border/60 bg-transparent px-0 py-3 text-sm font-medium tracking-wide text-foreground placeholder:text-foreground/30 focus:border-foreground focus:outline-none"
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold tracking-[0.2em] text-foreground/70">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                className="w-full border-b border-border/60 bg-transparent px-0 py-3 text-sm font-medium tracking-wide text-foreground placeholder:text-foreground/30 focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] font-bold tracking-[0.2em] text-foreground/70">
                MOT DE PASSE
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border-b border-border/60 bg-transparent px-0 py-3 pr-10 text-sm font-medium tracking-wide text-foreground placeholder:text-foreground/30 focus:border-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" strokeWidth={1.5} /> : <Eye className="h-4 w-4" strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] font-bold tracking-[0.15em] text-foreground/50 transition-colors hover:text-foreground">
                  MOT DE PASSE OUBLIÉ ?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-foreground px-8 py-4 text-xs font-bold tracking-[0.2em] text-background transition-opacity hover:opacity-80"
            >
              {mode === "login" ? "SE CONNECTER" : "CRÉER MON COMPTE"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-foreground/60">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà membre ?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="font-bold text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground"
              >
                {mode === "login" ? "S'inscrire" : "Se connecter"}
              </button>
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
