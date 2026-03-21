-- permissions: Granular capabilities using resource:action naming convention.
-- Assigned to roles (not directly to users).
-- See README.md for full design rationale and field documentation.

CREATE TABLE permissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,             -- e.g., "posts:create", "billing:read", "users:delete".
  name            TEXT NOT NULL,                    -- Display name (e.g., "Create Posts").
  description     TEXT,
  resource_type   TEXT,                             -- Groups permissions by resource for building permission UIs.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_permissions_resource_type ON permissions (resource_type) WHERE resource_type IS NOT NULL;
