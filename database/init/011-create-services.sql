CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL CHECK (length(btrim(name)) > 0),
  slug VARCHAR(150) NOT NULL CHECK (length(btrim(slug)) > 0),
  description TEXT,
  image_url VARCHAR(500),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  buffer_before_minutes INTEGER NOT NULL DEFAULT 0 CHECK (buffer_before_minutes >= 0),
  buffer_after_minutes INTEGER NOT NULL DEFAULT 0 CHECK (buffer_after_minutes >= 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  deposit_amount NUMERIC(10, 2) CHECK (deposit_amount >= 0 AND deposit_amount <= price),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS services_clinic_id_idx
  ON services (clinic_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS services_category_id_idx
  ON services (category_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS services_is_active_idx
  ON services (is_active)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS services_clinic_id_slug_unique_idx
  ON services (clinic_id, LOWER(slug))
  WHERE deleted_at IS NULL;
