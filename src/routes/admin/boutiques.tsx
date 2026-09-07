import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Lock, Trash2, Pencil, Plus } from "lucide-react";
import {
  listBoutiquesAdmin,
  createBoutique,
  updateBoutique,
  deleteBoutique,
  lockAdmin,
} from "@/lib/admin-boutiques.functions";

export const Route = createFileRoute("/admin/boutiques")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["admin-boutiques"],
      queryFn: () => listBoutiquesAdmin(),
    });
  },
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

type BoutiqueForm = {
  name: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  permanent_offer: string;
  unique_offer: string;
  is_active: boolean;
};

const EMPTY: BoutiqueForm = {
  name: "",
  area: "",
  address: "",
  lat: 47.2155,
  lng: -1.5554,
  permanent_offer: "",
  unique_offer: "",
  is_active: true,
};

const inputClass =
  "w-full border border-border/40 bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground";

function AdminBoutiques() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: boutiques = [] } = useQuery({
    queryKey: ["admin-boutiques"],
    queryFn: () => listBoutiquesAdmin(),
  });

  const create = useServerFn(createBoutique);
  const update = useServerFn(updateBoutique);
  const remove = useServerFn(deleteBoutique);
  const lock = useServerFn(lockAdmin);

  const [editing, setEditing] = useState<(BoutiqueForm & { id?: string }) | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      area: String(form.get("area")),
      address: String(form.get("address") || ""),
      lat: Number(form.get("lat")),
      lng: Number(form.get("lng")),
      permanent_offer: String(form.get("permanent_offer") || ""),
      unique_offer: String(form.get("unique_offer") || ""),
      is_active: form.get("is_active") === "on",
    };

    if (editing.id) {
      await update({ data: { id: editing.id, ...payload } });
    } else {
      await create({ data: payload });
    }
    setEditing(null);
    await queryClient.invalidateQueries({ queryKey: ["admin-boutiques"] });
  }

  async function onDelete(id: string) {
    if (!confirm("Supprimer cette boutique ?")) return;
    await remove({ data: { id } });
    await queryClient.invalidateQueries({ queryKey: ["admin-boutiques"] });
  }

  async function logout() {
    await lock();
    await router.navigate({ to: "/admin/unlock" });
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12 text-foreground md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-xl font-black tracking-[0.18em]">
            VSTR
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditing({ ...EMPTY })}
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

        {editing && (
          <form onSubmit={onSubmit} className="mt-8 border border-border/40 bg-card p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.1em]">
              {editing.id ? "Modifier" : "Nouvelle boutique"}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                name="name"
                defaultValue={editing.name}
                placeholder="Nom"
                required
                className={inputClass}
              />
              <input
                name="area"
                defaultValue={editing.area}
                placeholder="Quartier"
                required
                className={inputClass}
              />
              <input
                name="address"
                defaultValue={editing.address}
                placeholder="Adresse"
                className={inputClass}
              />
              <input
                name="lat"
                type="number"
                step="any"
                defaultValue={editing.lat}
                placeholder="Latitude"
                required
                className={inputClass}
              />
              <input
                name="lng"
                type="number"
                step="any"
                defaultValue={editing.lng}
                placeholder="Longitude"
                required
                className={inputClass}
              />
              <select
                name="offer_type"
                defaultValue={editing.offer_type}
                className={`${inputClass} appearance-none`}
              >
                <option value="permanent">Permanente</option>
                <option value="unique">Unique</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={editing.is_active}
                  className="h-4 w-4 accent-foreground"
                />
                Active
              </label>
            </div>
            <textarea
              name="offer"
              defaultValue={editing.offer}
              placeholder="Offre"
              required
              rows={3}
              className={`${inputClass} mt-4`}
            />
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="bg-foreground px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-80"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
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
                <th className="pb-3 font-normal">Offre</th>
                <th className="pb-3 font-normal">Type</th>
                <th className="pb-3 font-normal">Statut</th>
                <th className="pb-3 font-normal"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {boutiques.map((b) => (
                <tr key={b.id} className="group">
                  <td className="py-4 font-bold">{b.name}</td>
                  <td className="py-4 text-foreground/70">{b.area}</td>
                  <td className="py-4 text-foreground/70">{b.offer}</td>
                  <td className="py-4 text-foreground/70">{b.offer_type}</td>
                  <td className="py-4 text-foreground/70">
                    {b.is_active ? "Active" : "Inactive"}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2 opacity-60 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() =>
                          setEditing({
                            id: b.id,
                            name: b.name,
                            area: b.area,
                            address: b.address ?? "",
                            lat: b.lat,
                            lng: b.lng,
                            offer: b.offer,
                            offer_type: b.offer_type as "permanent" | "unique",
                            is_active: b.is_active,
                          })
                        }
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
