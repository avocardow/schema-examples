-- providers: Staff members or professionals who deliver bookable services.
-- See README.md for full design rationale.

CREATE TABLE providers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  display_name    TEXT NOT NULL,
  bio             TEXT,
  avatar_url      TEXT,
  timezone        TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_accepting    BOOLEAN NOT NULL DEFAULT TRUE,
  position        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_providers_is_active_is_accepting ON providers (is_active, is_accepting);
CREATE INDEX idx_providers_is_active_position ON providers (is_active, position);
