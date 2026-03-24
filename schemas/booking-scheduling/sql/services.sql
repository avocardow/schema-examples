-- services: Bookable offerings with duration, pricing, and capacity configuration.
-- See README.md for full design rationale.

CREATE TABLE services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id     UUID REFERENCES service_categories (id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  duration        INTEGER NOT NULL,
  buffer_before   INTEGER NOT NULL DEFAULT 0,
  buffer_after    INTEGER NOT NULL DEFAULT 0,
  price           NUMERIC,
  currency        TEXT,
  max_attendees   INTEGER NOT NULL DEFAULT 1,
  min_attendees   INTEGER NOT NULL DEFAULT 1,
  min_notice      INTEGER NOT NULL DEFAULT 0,
  max_advance     INTEGER NOT NULL DEFAULT 43200,
  slot_interval   INTEGER,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  is_private      BOOLEAN NOT NULL DEFAULT FALSE,
  color           TEXT,
  created_by      UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_category_id ON services (category_id);
CREATE INDEX idx_services_is_active_is_private ON services (is_active, is_private);
CREATE INDEX idx_services_created_by ON services (created_by);
