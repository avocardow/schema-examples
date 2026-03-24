-- locations: Physical venues or virtual meeting spaces where bookings take place.
-- See README.md for full design rationale.

CREATE TYPE location_type AS ENUM ('physical', 'virtual');

CREATE TABLE locations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  type            location_type NOT NULL DEFAULT 'physical',
  description     TEXT,
  address_line1   TEXT,
  address_line2   TEXT,
  city            TEXT,
  state           TEXT,
  postal_code     TEXT,
  country         TEXT,
  virtual_url     TEXT,
  timezone        TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  position        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_locations_type ON locations (type);
CREATE INDEX idx_locations_is_active_position ON locations (is_active, position);
