CREATE TABLE IF NOT EXISTS clinics (
  id UUID PRIMARY KEY,
  name VARCHAR(150) NOT NULL CHECK (length(btrim(name)) > 0),
  slug VARCHAR(150) NOT NULL UNIQUE CHECK (length(btrim(slug)) > 0),
  description TEXT,
  logo_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(30),
  website VARCHAR(255),
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS clinics_active_created_at_id_idx
  ON clinics (created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS clinics_slug_idx
  ON clinics (slug)
  WHERE deleted_at IS NULL;
