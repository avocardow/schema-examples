-- schedules: Named availability configurations owned by providers.
-- See README.md for full design rationale.

CREATE TABLE schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     UUID NOT NULL REFERENCES providers (id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  timezone        TEXT NOT NULL,
  is_default      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedules_provider_id_is_default ON schedules (provider_id, is_default);
