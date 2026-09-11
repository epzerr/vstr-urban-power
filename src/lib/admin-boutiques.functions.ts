import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type Boutique = Database["public"]["Tables"]["boutiques"]["Row"];

const boutiqueSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  area: z.string().min(1, "Le quartier est requis"),
  address: z.string().default(""),
  lat: z.number(),
  lng: z.number(),
  permanent_offer: z.string().default(""),
  unique_offer: z.string().default(""),
  is_active: z.boolean().default(true),
});

export const listBoutiquesAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("boutiques").select("*").order("name");
  if (error) throw error;
  return data ?? [];
});

function toRow(data: z.infer<typeof boutiqueSchema>) {
  const permanent = data.permanent_offer.trim();
  const unique = data.unique_offer.trim();
  if (!permanent && !unique) throw new Error("Renseignez au moins une offre");
  return {
    name: data.name,
    area: data.area,
    address: data.address.trim() || null,
    lat: data.lat,
    lng: data.lng,
    permanent_offer: permanent || null,
    unique_offer: unique || null,
    offer: permanent || unique,
    offer_type: permanent ? "permanent" : "unique",
    is_active: data.is_active,
  };
}

export const createBoutique = createServerFn({ method: "POST" })
  .inputValidator((data) => boutiqueSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("boutiques").insert(toRow(data));
    if (error) throw error;
    return { ok: true as const };
  });

const updateSchema = boutiqueSchema.extend({ id: z.string().uuid() });

export const updateBoutique = createServerFn({ method: "POST" })
  .inputValidator((data) => updateSchema.parse(data))
  .handler(async ({ data }) => {
    const { id, ...rest } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("boutiques").update(toRow(rest)).eq("id", id);
    if (error) throw error;
    return { ok: true as const };
  });

export const deleteBoutique = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("boutiques").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });
