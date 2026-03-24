-- bookings: Core appointment records linking customers with providers at specific times.
-- See README.md for full design rationale.

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'declined', 'no_show');
CREATE TYPE booking_source AS ENUM ('online', 'manual', 'api', 'import');
CREATE TYPE booking_payment_status AS ENUM ('not_required', 'pending', 'paid', 'refunded', 'partially_refunded');

CREATE TABLE bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id         UUID NOT NULL,
  location_id         UUID,
  customer_id         UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  schedule_id         UUID,
  start_time          TIMESTAMPTZ NOT NULL,
  end_time            TIMESTAMPTZ NOT NULL,
  timezone            TEXT NOT NULL,
  status              booking_status NOT NULL DEFAULT 'pending',
  cancelled_by        UUID REFERENCES users (id) ON DELETE SET NULL,
  cancellation_reason TEXT,
  cancelled_at        TIMESTAMPTZ,
  customer_notes      TEXT,
  provider_notes      TEXT,
  source              booking_source NOT NULL DEFAULT 'online',
  payment_status      booking_payment_status NOT NULL DEFAULT 'not_required',
  recurrence_group_id UUID,
  recurrence_rule     TEXT,
  confirmed_at        TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_provider_id_start_time ON bookings (provider_id, start_time);
CREATE INDEX idx_bookings_customer_id_start_time ON bookings (customer_id, start_time);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_start_time_end_time ON bookings (start_time, end_time);
CREATE INDEX idx_bookings_location_id ON bookings (location_id);
CREATE INDEX idx_bookings_recurrence_group_id ON bookings (recurrence_group_id);

-- Forward FK: providers, locations, and schedules load after this file alphabetically.
ALTER TABLE bookings
  ADD CONSTRAINT fk_bookings_provider
  FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE RESTRICT;

ALTER TABLE bookings
  ADD CONSTRAINT fk_bookings_location
  FOREIGN KEY (location_id) REFERENCES locations (id) ON DELETE SET NULL;

ALTER TABLE bookings
  ADD CONSTRAINT fk_bookings_schedule
  FOREIGN KEY (schedule_id) REFERENCES schedules (id) ON DELETE SET NULL;
