-- roles: Named sets of permissions with human-readable slugs.
-- Two-tier scope: "environment" (app-wide) and "organization" (org-scoped).
-- See README.md for full design rationale and field documentation.

CREATE TYPE role_scope AS ENUM ('environment', 'organization');

CREATE TABLE roles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,             -- e.g., "admin", "org:editor", "viewer". Used in code.
  name            TEXT NOT NULL,                    -- Display name for admin UIs.
  description     TEXT,
  scope           role_scope NOT NULL,              -- "environment" = app-wide. "organization" = per-org.
  is_system       BOOLEAN NOT NULL DEFAULT FALSE,   -- System roles cannot be deleted.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roles_scope ON roles (scope);
