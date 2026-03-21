-- api_keys: Long-lived keys for programmatic access (scripts, CI/CD, integrations).
-- The full key is shown once at creation — only the hash is stored.
-- See README.md for full design rationale and field documentation.

CREATE TABLE api_keys (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,           -- NULL for org-level keys.
  organization_id   UUID REFERENCES organizations(id) ON DELETE CASCADE,   -- NULL for personal keys.
  name              TEXT NOT NULL,                  -- User-assigned label (e.g., "CI/CD Pipeline").
  key_prefix        TEXT NOT NULL,                  -- First 8 chars for identification (e.g., "sk_live_Ab").
  key_hash          TEXT UNIQUE NOT NULL,           -- SHA-256 hash of the full key.

  scopes            TEXT[],                         -- e.g., '{"read:users","write:posts"}'. Define your NULL semantics.

  last_used_at      TIMESTAMPTZ,
  last_used_ip      TEXT,
  expires_at        TIMESTAMPTZ,                    -- NULL = never expires.
  revoked_at        TIMESTAMPTZ,                    -- NULL = active. Set to revoke without deleting.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user_id ON api_keys (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_api_keys_organization_id ON api_keys (organization_id) WHERE organization_id IS NOT NULL;
