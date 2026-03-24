-- booking_reminders: Scheduled reminder notifications for upcoming bookings.
-- See README.md for full design rationale.

CREATE TYPE reminder_target AS ENUM ('customer', 'provider', 'all');
CREATE TYPE reminder_status AS ENUM ('pending', 'sent', 'failed', 'cancelled');

CREATE TABLE booking_reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL,
  remind_at       TIMESTAMPTZ NOT NULL,
  type            reminder_target NOT NULL DEFAULT 'customer',
  offset_minutes  INTEGER NOT NULL,
  status          reminder_status NOT NULL DEFAULT 'pending',
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_reminders_booking_id ON booking_reminders (booking_id);
CREATE INDEX idx_booking_reminders_status_remind_at ON booking_reminders (status, remind_at);

-- Forward FK: bookings loads after this file alphabetically.
ALTER TABLE booking_reminders
  ADD CONSTRAINT fk_booking_reminders_booking
  FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE;
