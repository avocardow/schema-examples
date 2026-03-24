-- provider_locations: Maps providers to the locations where they operate.
-- See README.md for full design rationale.

CREATE TABLE provider_locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     UUID NOT NULL,
  location_id     UUID NOT NULL REFERENCES locations (id) ON DELETE CASCADE,
  is_primary      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (provider_id, location_id)
);

CREATE INDEX idx_provider_locations_location_id ON provider_locations (location_id);

-- Forward FK: providers loads after this file alphabetically.
ALTER TABLE provider_locations
  ADD CONSTRAINT fk_provider_locations_provider
  FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE;
