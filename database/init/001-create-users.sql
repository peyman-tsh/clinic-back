CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL CHECK (length(btrim(first_name)) > 0),
  last_name VARCHAR(100) NOT NULL CHECK (length(btrim(last_name)) > 0),
  email VARCHAR(320) NOT NULL UNIQUE,
  phone VARCHAR(32),
  avatar TEXT,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'suspended')),
  department_id UUID,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS users_active_created_at_id_idx
  ON users (created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS users_active_department_id_idx
  ON users (department_id)
  WHERE deleted_at IS NULL AND department_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS users_active_manager_id_idx
  ON users (manager_id)
  WHERE deleted_at IS NULL AND manager_id IS NOT NULL;
