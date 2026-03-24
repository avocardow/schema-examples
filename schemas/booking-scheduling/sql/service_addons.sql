-- service_addons: Optional extras that can be added to a service booking for additional time or cost.
-- See README.md for full design rationale.

CREATE TABLE service_addons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  duration        INTEGER NOT NULL DEFAULT 0,
  price           NUMERIC NOT NULL DEFAULT 0,
  currency        TEXT,
  position        INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_addons_service_id_position ON service_addons (service_id, position);
CREATE INDEX idx_service_addons_is_active ON service_addons (is_active);

-- Forward FK: services loads after this file alphabetically.
ALTER TABLE service_addons
  ADD CONSTRAINT fk_service_addons_service
  FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE;
