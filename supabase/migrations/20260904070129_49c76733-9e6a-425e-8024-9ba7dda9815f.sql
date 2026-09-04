CREATE TABLE public.boutiques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  area text NOT NULL,
  address text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  offer text NOT NULL,
  offer_type text NOT NULL DEFAULT 'permanent',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.boutiques TO anon;
GRANT SELECT ON public.boutiques TO authenticated;
GRANT ALL ON public.boutiques TO service_role;

ALTER TABLE public.boutiques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active boutiques"
  ON public.boutiques
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER boutiques_updated_at
  BEFORE UPDATE ON public.boutiques
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();