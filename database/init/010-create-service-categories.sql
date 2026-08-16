CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL CHECK (length(btrim(name)) > 0),
  slug VARCHAR(150) NOT NULL CHECK (length(btrim(slug)) > 0),
  description TEXT,
  image_url VARCHAR(500),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS service_categories_clinic_id_idx
  ON service_categories (clinic_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS service_categories_is_active_idx
  ON service_categories (is_active)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS service_categories_clinic_id_slug_unique_idx
  ON service_categories (clinic_id, LOWER(slug))
  WHERE deleted_at IS NULL;
