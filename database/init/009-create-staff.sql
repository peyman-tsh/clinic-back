CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  job_title VARCHAR(100),
  bio TEXT,
  license_number VARCHAR(100),
  color VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS staff_clinic_id_idx
  ON staff (clinic_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS staff_status_idx
  ON staff (status)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS staff_branches (
  id UUID PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT staff_branches_staff_id_branch_id_unique UNIQUE (staff_id, branch_id)
);

CREATE INDEX IF NOT EXISTS staff_branches_staff_id_idx
  ON staff_branches (staff_id);

CREATE INDEX IF NOT EXISTS staff_branches_branch_id_idx
  ON staff_branches (branch_id);
