-- integration_definitions: Catalogue of available third-party integrations.
-- See README.md for full design rationale.

CREATE TYPE integration_auth_method AS ENUM ('oauth2', 'api_key', 'webhook', 'none');

CREATE TABLE integration_definitions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key           TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  description   TEXT,
  icon_url      TEXT,
  auth_method   integration_auth_method NOT NULL,
  config_schema JSONB,
  is_enabled    BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_integration_definitions_is_enabled ON integration_definitions (is_enabled);
