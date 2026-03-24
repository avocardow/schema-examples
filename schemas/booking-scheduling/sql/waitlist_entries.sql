-- waitlist_entries: Customers waiting for availability on a specific service and date.
-- See README.md for full design rationale.

CREATE TYPE waitlist_status AS ENUM ('waiting', 'notified', 'booked', 'expired', 'cancelled');

CREATE TABLE waitlist_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID NOT NULL REFERENCES services (id) ON DELETE CASCADE,
  provider_id     UUID REFERENCES providers (id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  location_id     UUID REFERENCES locations (id) ON DELETE SET NULL,
  preferred_date  TEXT NOT NULL,
  preferred_start TEXT,
  preferred_end   TEXT,
  status          waitlist_status NOT NULL DEFAULT 'waiting',
  notified_at     TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_waitlist_entries_service_id_preferred_date_status ON waitlist_entries (service_id, preferred_date, status);
CREATE INDEX idx_waitlist_entries_customer_id_status ON waitlist_entries (customer_id, status);
CREATE INDEX idx_waitlist_entries_status_notified_at ON waitlist_entries (status, notified_at);
