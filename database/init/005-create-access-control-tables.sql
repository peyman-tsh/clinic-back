CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (length(btrim(name)) BETWEEN 2 AND 100),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS roles_active_name_ci_unique
  ON roles (LOWER(name))
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS roles_active_created_at_id_idx
  ON roles (created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL CHECK (length(btrim(name)) BETWEEN 2 AND 100),
  module VARCHAR(100) NOT NULL CHECK (length(btrim(module)) BETWEEN 2 AND 100),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS permissions_active_module_name_ci_unique
  ON permissions (LOWER(module), LOWER(name))
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS permissions_active_module_name_idx
  ON permissions (module, name)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS role_permissions_permission_id_idx
  ON role_permissions (permission_id);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS user_roles_role_id_idx
  ON user_roles (role_id);
