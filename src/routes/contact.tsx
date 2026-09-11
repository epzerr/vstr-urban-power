import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/supabase";
import AuthNavButton from "@/components/AuthNavButton";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Votre nom est requis").max(100, "Maximum 100 caractères"),
  email: z.string().trim().email("Adresse e-mail invalide").max(255, "Maximum 255 caractères"),
  subject: z.string().trim().min(1, "Le sujet est requis").max(150, "Maximum 150 caractères"),
  message: z.string().trim().min(1, "Votre message est requis").max(1000, "Maximum 1000 caractères"),
});

type ContactForm = z.infer<typeof contactSchema>;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — VSTR" },
      {
        name: "description",
        content:
          "Contactez l'équipe VSTR pour devenir partenaire ou poser vos questions sur l'abonnement urbain.",
      },
      { property: "og:title", content: "Contact — VSTR" },
      {
        property: "og:description",
        content:
          "Contactez l'équipe VSTR pour devenir partenaire ou poser vos questions sur l'abonnement urbain.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (field: keyof ContactForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactForm;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("partenaires_leads").insert({
      nom: result.data.name,
      email: result.data.email,
      sujet: result.data.subject,
      message: result.data.message,
    });
    setSubmitting(false);

    if (error) {
      setSubmitError("L'envoi a échoué. Réessayez dans un instant.");
      return;
    }

    const nom = result.data.name;
    const email = result.data.email;
    const sujet = result.data.subject;
    const message = result.data.message;
    fetch("https://hook.eu1.make.com/ita87yo414brnmxe2o3ipil5bc2v8nla ", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email, sujet, message }),
    });

    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setSubmitted(true);
  };

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
              className="text-sm tracking-wide text-foreground transition-colors"
            >
              Devenir partenaire
            </Link>
          </nav>
          <AuthNavButton />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 pt-40 pb-32 md:px-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> RETOUR
        </Link>
        <p className="mt-10 text-xs tracking-[0.45em] text-foreground/60">CONTACT</p>
        <h1 className="mt-6 text-[clamp(2rem,5vw,4.25rem)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
          Devenir partenaire ou nous écrire.
        </h1>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-foreground/60">
          Vous êtes commerçant en centre-ville ou vous souhaitez simplement en savoir plus ? Remplissez
          le formulaire ci-dessous, l'équipe VSTR vous répondra sous 48 heures.
        </p>

        {submitted ? (
          <div className="mt-14 border border-foreground/15 p-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.15em]">Message envoyé</p>
            <p className="mt-4 text-sm text-foreground/60">
              Merci pour votre intérêt. Nous revenons vers vous très vite.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-8 border border-foreground/25 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors hover:bg-foreground/10"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-14 space-y-8">
            <div>
              <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                Nom
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-3 block w-full border-b border-foreground/20 bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                placeholder="Votre nom"
              />
              {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="mt-3 block w-full border-b border-foreground/20 bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                placeholder="vous@exemple.com"
              />
              {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                Sujet
              </label>
              <input
                id="subject"
                type="text"
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className="mt-3 block w-full border-b border-foreground/20 bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                placeholder="Devenir partenaire, presse, autre..."
              />
              {errors.subject && <p className="mt-2 text-xs text-red-400">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="mt-3 block w-full border-b border-foreground/20 bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
                placeholder="Dites-nous en quelques mots qui vous êtes et ce que vous recherchez."
              />
              {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message}</p>}
            </div>

            {submitError && <p className="text-xs text-red-400">{submitError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 bg-foreground px-8 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Envoi en cours…" : "Envoyer le message"}
            </button>
          </form>
        )}
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
