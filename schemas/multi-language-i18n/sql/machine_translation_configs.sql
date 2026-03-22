-- machine_translation_configs: MT engine configurations with API credentials and rate limits.
-- See README.md for full design rationale.

CREATE TABLE machine_translation_configs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  engine                TEXT NOT NULL,
  is_enabled            BOOLEAN NOT NULL DEFAULT TRUE,
  is_default            BOOLEAN NOT NULL DEFAULT FALSE,
  api_key_ref           TEXT,
  endpoint_url          TEXT,
  supported_locales     JSONB,
  default_quality_score NUMERIC,
  rate_limit            INTEGER,
  options               JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
