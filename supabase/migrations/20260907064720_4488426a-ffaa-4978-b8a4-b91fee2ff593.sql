ALTER TABLE public.boutiques
  ADD COLUMN IF NOT EXISTS permanent_offer text,
  ADD COLUMN IF NOT EXISTS unique_offer text;

UPDATE public.boutiques
SET permanent_offer = CASE WHEN offer_type = 'permanent' THEN offer ELSE permanent_offer END,
    unique_offer = CASE WHEN offer_type = 'unique' THEN offer ELSE unique_offer END;

ALTER TABLE public.boutiques ALTER COLUMN offer DROP NOT NULL;
ALTER TABLE public.boutiques ALTER COLUMN offer SET DEFAULT '';