CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL CHECK (length(btrim(name)) > 0),
  code VARCHAR(50),
  email VARCHAR(255),
  phone VARCHAR(30),
  address_line1 VARCHAR(255) NOT NULL CHECK (length(btrim(address_line1)) > 0),
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL CHECK (length(btrim(city)) > 0),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country_code VARCHAR(2) NOT NULL CHECK (length(btrim(country_code)) = 2),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  timezone VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS branches_clinic_id_idx
  ON branches (clinic_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS branches_city_idx
  ON branches (city)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS branches_status_idx
  ON branches (status)
  WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS branches_clinic_id_code_unique_idx
  ON branches (clinic_id, LOWER(code))
  WHERE deleted_at IS NULL AND code IS NOT NULL;
