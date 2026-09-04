import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type Boutique = Database["public"]["Tables"]["boutiques"]["Row"];

const sessionConfig = {
  password: process.env["SESSION_SECRET"]!,
  name: "vstr-admin-gate",
  maxAge: 60 * 60 * 24 * 7,
  cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
};

type AdminSession = { unlocked?: boolean };

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireUnlocked() {
  const session = await useSession<AdminSession>(sessionConfig);
  if (!session.data.unlocked) throw redirect({ to: "/admin/unlock" });
  return session;
}

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"];
    if (!expected) throw new Error("SITE_PASSWORD is not set");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig);
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig);
  await session.clear();
  return { ok: true as const };
});

const boutiqueSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  area: z.string().min(1, "Le quartier est requis"),
  address: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  offer: z.string().min(1, "L'offre est requise"),
  offer_type: z.enum(["permanent", "unique"]).default("permanent"),
  is_active: z.boolean().default(true),
});

export const listBoutiquesAdmin = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("boutiques").select("*").order("name");
  if (error) throw error;
  return data ?? [];
});

export const createBoutique = createServerFn({ method: "POST" })
  .inputValidator((data) => boutiqueSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("boutiques").insert(data);
    if (error) throw error;
    return { ok: true as const };
  });

const updateSchema = boutiqueSchema.extend({ id: z.string().uuid() });

export const updateBoutique = createServerFn({ method: "POST" })
  .inputValidator((data) => updateSchema.parse(data))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { id, ...rest } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("boutiques").update(rest).eq("id", id);
    if (error) throw error;
    return { ok: true as const };
  });

export const deleteBoutique = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("boutiques").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });
