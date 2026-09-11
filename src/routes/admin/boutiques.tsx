import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Lock, Trash2, Pencil, Plus } from "lucide-react";
import { supabase } from "@/supabase";

export const Route = createFileRoute("/admin/boutiques")({
  head: () => ({
    meta: [
      { title: "Admin VSTR — Boutiques" },
      { name: "description", content: "Gestion des boutiques partenaires VSTR." },
      { property: "og:title", content: "Admin VSTR — Boutiques" },
      { property: "og:description", content: "Gestion des boutiques partenaires VSTR." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminBoutiques,
});

type BoutiqueRow = {
  id: string;
  nom: string;
  quartier: string;
  adresse: string | null;
  latitude: number;
  longitude: number;
  active: boolean;
  offre_permanente: string | null;
  offre_unique: string | null;
};

type BoutiqueForm = {
  nom: string;
  quartier: string;
  adresse: string;
  latitude: string;
  longitude: string;
  active: boolean;
  offre_permanente: string;
  offre_unique: string;
};

const EMPTY: BoutiqueForm = {
  nom: "",
  quartier: "",
  adresse: "",
  latitude: "47.2155",
  longitude: "-1.5554",
  active: true,
  offre_permanente: "",
  offre_unique: "",
};

const inputClass =
  "w-full border border-border/40 bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";

function parseCoord(value: string): number {
  return parseFloat(String(value).trim().replace(",", "."));
}

async function fetchBoutiques(): Promise<BoutiqueRow[]> {
  const { data, error } = await supabase.from("boutiques").select("*").order("nom");
  if (error) throw error;
  return (data ?? []) as BoutiqueRow[];
}

function AdminBoutiques() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [authorized, setAuthorized] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate({ to: "/admin/unlock" });
      return;
    }
    setAuthorized(true);
  }, [navigate]);

  const { data: boutiques = [] } = useQuery({
    queryKey: ["admin-boutiques"],
    queryFn: fetchBoutiques,
    enabled: authorized,
  });

  const [editing, setEditing] = useState<(BoutiqueForm & { id?: string }) | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;

    setFormError(null);
    setSuccess(null);

    const form = new FormData(e.currentTarget);
    const offre_permanente = String(form.get("offre_permanente") || "").trim();
    const offre_unique = String(form.get("offre_unique") || "").trim();

    if (!offre_permanente && !offre_unique) {
      setFormError("Renseignez au moins une des deux offres.");
      return;
    }

    const latitude = parseCoord(String(form.get("latitude") || ""));
    const longitude = parseCoord(String(form.get("longitude") || ""));

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setFormError("Latitude et longitude doivent être des nombres valides.");
      return;
    }

    const payload = {
      nom: String(form.get("nom")).trim(),
      quartier: String(form.get("quartier")).trim(),
      adresse: String(form.get("adresse") || "").trim() || null,
      latitude,
      longitude,
      active: form.get("active") === "on",
      offre_permanente: offre_permanente || null,
      offre_unique: offre_unique || null,
    };

    setSubmitting(true);

    if (editing.id) {
      const { error } = await supabase.from("boutiques").update(payload).eq("id", editing.id);
      setSubmitting(false);
      if (error) {
        setFormError("La mise à jour a échoué. Réessayez.");
        return;
      }
      setSuccess("Boutique mise à jour.");
      setEditing(null);
    } else {
      const { error } = await supabase.from("boutiques").insert(payload);
      setSubmitting(false);
      if (error) {
        setFormError("L'ajout a échoué. Réessayez.");
        return;
      }
      setSuccess("Boutique ajoutée avec succès.");
      setEditing({ ...EMPTY });
      setFormKey((k) => k + 1);
    }

    await queryClient.invalidateQueries({ queryKey: ["admin-boutiques"] });
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer cette boutique ?")) return;
    const { error } = await supabase.from("boutiques").delete().eq("id", id);
    if (error) {
      setFormError("La suppression a échoué. Réessayez.");
      return;
    }
    setSuccess("Boutique supprimée.");
    await queryClient.invalidateQueries({ queryKey: ["admin-boutiques"] });
  }

  function logout() {
    localStorage.removeItem("isAdmin");
    navigate({ to: "/admin/unlock" });
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-xl font-black tracking-[0.18em]">
            VSTR
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setFormError(null);
                setEditing({ ...EMPTY });
              }}
              className="inline-flex items-center gap-2 bg-foreground px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-80"
            >
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 border border-border/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:bg-foreground/10"
            >
              <Lock className="h-3.5 w-3.5" /> Verrouiller
            </button>
          </div>
        </div>

        <h1 className="mt-10 text-2xl font-black uppercase tracking-[0.08em]">
          Boutiques partenaires
        </h1>

        {success && (
          <p className="mt-6 border border-foreground/15 px-4 py-3 text-sm text-foreground/80">
            {success}
          </p>
        )}
        {formError && !editing && (
          <p className="mt-6 text-sm text-destructive">{formError}</p>
        )}

        {editing && (
          <form
            key={formKey}
            onSubmit={onSubmit}
            className="mt-8 border border-border/40 bg-card p-6"
          >
            <h2 className="text-sm font-black uppercase tracking-[0.1em]">
              {editing.id ? "Modifier" : "Nouvelle boutique"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                name="nom"
                defaultValue={editing.nom}
                placeholder="Nom"
                required
                className={inputClass}
              />
              <input
                name="quartier"
                defaultValue={editing.quartier}
                placeholder="Quartier"
                required
                className={inputClass}
              />
              <input
                name="adresse"
                defaultValue={editing.adresse}
                placeholder="Adresse"
                className={inputClass}
              />
              <input
                name="latitude"
                type="text"
                inputMode="decimal"
                defaultValue={editing.latitude}
                placeholder="Latitude"
                required
                className={inputClass}
              />
              <input
                name="longitude"
                type="text"
                inputMode="decimal"
                defaultValue={editing.longitude}
                placeholder="Longitude"
                required
                className={inputClass}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={editing.active}
                  className="h-4 w-4 accent-foreground"
                />
                Active
              </label>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/60">
                  Offre permanente
                </label>
                <input
                  name="offre_permanente"
                  defaultValue={editing.offre_permanente}
                  placeholder="Ex : -10% toute l'année"
                  className={`${inputClass} mt-2`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-foreground/60">
                  Offre unique (une seule utilisation)
                </label>
                <input
                  name="offre_unique"
                  defaultValue={editing.offre_unique}
                  placeholder="Ex : -20% une fois"
                  className={`${inputClass} mt-2`}
                />
              </div>
            </div>
            <p className="mt-3 text-xs text-foreground/50">
              Renseignez au moins une des deux offres.
            </p>
            {formError && <p className="mt-3 text-xs text-destructive">{formError}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-foreground px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setFormError(null);
                }}
                className="border border-border/40 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:bg-foreground/10"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/40 text-xs uppercase tracking-[0.1em] text-foreground/60">
              <tr>
                <th className="pb-3 font-normal">Nom</th>
                <th className="pb-3 font-normal">Quartier</th>
                <th className="pb-3 font-normal">Offre permanente</th>
                <th className="pb-3 font-normal">Offre unique</th>
                <th className="pb-3 font-normal">Statut</th>
                <th className="pb-3 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {boutiques.map((b) => (
                <tr key={b.id} className="group">
                  <td className="py-4 font-bold">{b.nom}</td>
                  <td className="py-4 text-foreground/70">{b.quartier}</td>
                  <td className="py-4 text-foreground/70">{b.offre_permanente ?? "—"}</td>
                  <td className="py-4 text-foreground/70">{b.offre_unique ?? "—"}</td>
                  <td className="py-4 text-foreground/70">{b.active ? "Active" : "Inactive"}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2 opacity-60 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setFormError(null);
                          setEditing({
                            id: b.id,
                            nom: b.nom,
                            quartier: b.quartier,
                            adresse: b.adresse ?? "",
                            latitude: String(b.latitude),
                            longitude: String(b.longitude),
                            active: b.active,
                            offre_permanente: b.offre_permanente ?? "",
                            offre_unique: b.offre_unique ?? "",
                          });
                        }}
                        className="p-2 transition-colors hover:bg-foreground/10"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(b.id)}
                        className="p-2 transition-colors hover:bg-destructive/20"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
