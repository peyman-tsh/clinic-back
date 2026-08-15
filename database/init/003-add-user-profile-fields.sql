ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(32);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS manager_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(64) NOT NULL DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(10) NOT NULL DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

UPDATE users
SET
  first_name = COALESCE(NULLIF(split_part(btrim(name), ' ', 1), ''), 'User'),
  last_name = COALESCE(NULLIF(btrim(substring(btrim(name) FROM position(' ' IN btrim(name)) + 1)), ''), 'Unknown'),
  password_hash = COALESCE(password_hash, '$2b$12$Q.sr/75C0H4faQvjTZccL..MPauIpiYPIkFvjN9PnBhzQ4Z/QzxHy'),
  status = COALESCE(status, 'inactive')
WHERE first_name IS NULL OR last_name IS NULL OR password_hash IS NULL;

ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;

ALTER TABLE users DROP COLUMN IF EXISTS name;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_status_check'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_status_check
      CHECK (status IN ('active', 'inactive', 'suspended'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'users_manager_id_fkey'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_manager_id_fkey
      FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

DROP INDEX IF EXISTS users_created_at_id_idx;

CREATE INDEX IF NOT EXISTS users_active_created_at_id_idx
  ON users (created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS users_active_department_id_idx
  ON users (department_id)
  WHERE deleted_at IS NULL AND department_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS users_active_manager_id_idx
  ON users (manager_id)
  WHERE deleted_at IS NULL AND manager_id IS NOT NULL;
