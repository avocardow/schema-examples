-- booking_attendees: Tracks individual attendees for group or multi-person bookings.
-- See README.md for full design rationale.

CREATE TYPE attendee_status AS ENUM ('confirmed', 'cancelled', 'no_show');

CREATE TABLE booking_attendees (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL,
  user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
  name            TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  status          attendee_status NOT NULL DEFAULT 'confirmed',
  cancelled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_attendees_booking_id ON booking_attendees (booking_id);
CREATE INDEX idx_booking_attendees_user_id ON booking_attendees (user_id);
CREATE INDEX idx_booking_attendees_email ON booking_attendees (email);

-- Forward FK: bookings loads after this file alphabetically.
ALTER TABLE booking_attendees
  ADD CONSTRAINT fk_booking_attendees_booking
  FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE;
