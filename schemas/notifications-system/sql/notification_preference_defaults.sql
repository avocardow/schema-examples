-- notification_preference_defaults: System-level and tenant-level default preferences.
-- See README.md for full design rationale and field documentation.

-- Scope: "system" = all users platform-wide, "tenant" = all users within a specific organization.
CREATE TYPE preference_default_scope_enum AS ENUM ('system', 'tenant');

-- NOTE: channel_type_enum is defined in notification_channels.sql.

CREATE TABLE notification_preference_defaults (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Scope: where this default applies.
  -- "system" = applies to all users across the entire platform.
  -- "tenant" = applies to all users within a specific organization/tenant.
  scope           preference_default_scope_enum NOT NULL,

  -- Tenant ID: only set when scope = "tenant".
  -- Not a FK to keep this domain portable — some apps use organizations, some use workspaces, some use teams.
  scope_id        TEXT,                              -- The tenant/org ID. Null when scope = "system".

  -- Category and channel scope: same semantics as notification_preferences.
  category_id     UUID REFERENCES notification_categories(id) ON DELETE CASCADE,
  channel_type    channel_type_enum,

  enabled         BOOLEAN NOT NULL,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ⚠️  Nullable columns in unique constraints: In PostgreSQL, NULL != NULL for uniqueness,
--     so a plain UNIQUE(scope, scope_id, category_id, channel_type) won't prevent duplicate rows
--     when any of scope_id, category_id, or channel_type are NULL.
--     Use COALESCE wrappers to treat NULLs as sentinel values for uniqueness purposes.
CREATE UNIQUE INDEX idx_notification_preference_defaults_unique
  ON notification_preference_defaults (
    scope,
    COALESCE(scope_id, '__null__'),
    COALESCE(category_id, '00000000-0000-0000-0000-000000000000'),
    COALESCE(channel_type::TEXT, '__null__')
  );

CREATE INDEX idx_notification_preference_defaults_scope_id ON notification_preference_defaults (scope, scope_id);
CREATE INDEX idx_notification_preference_defaults_scope ON notification_preference_defaults (scope);
