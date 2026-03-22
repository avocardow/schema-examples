-- folder_permissions: Per-user permission grants on folders, supporting inheritance.
-- See README.md for full design rationale.

CREATE TYPE folder_permission_level AS ENUM ('view', 'edit', 'manage');

CREATE TABLE folder_permissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id         UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission        folder_permission_level NOT NULL DEFAULT 'view',
  inherited         BOOLEAN NOT NULL DEFAULT FALSE,
  granted_by        UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (folder_id, user_id)
);

CREATE INDEX idx_folder_permissions_user_id ON folder_permissions (user_id);
CREATE INDEX idx_folder_permissions_folder_id ON folder_permissions (folder_id);
