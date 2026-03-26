-- venues: Physical, virtual, or hybrid locations where events take place.
-- See README.md for full design rationale.

CREATE TYPE venue_type AS ENUM ('physical', 'virtual', 'hybrid');

CREATE TABLE venues (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  type                venue_type NOT NULL DEFAULT 'physical',
  address_line1       TEXT,
  address_line2       TEXT,
  city                TEXT,
  state               TEXT,
  postal_code         TEXT,
  country             TEXT,
  latitude            NUMERIC,
  longitude           NUMERIC,
  virtual_url         TEXT,
  virtual_platform    TEXT,
  capacity            INTEGER,
  timezone            TEXT NOT NULL,
  phone               TEXT,
  email               TEXT,
  website_url         TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_by          UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_venues_type ON venues (type);
CREATE INDEX idx_venues_city_state ON venues (city, state);
CREATE INDEX idx_venues_is_active ON venues (is_active);
CREATE INDEX idx_venues_created_by ON venues (created_by);
