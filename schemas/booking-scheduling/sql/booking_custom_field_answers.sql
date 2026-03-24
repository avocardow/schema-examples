-- booking_custom_field_answers: Stores customer responses to custom intake fields per booking.
-- See README.md for full design rationale.

CREATE TABLE booking_custom_field_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL,
  custom_field_id UUID NOT NULL,
  value           TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (booking_id, custom_field_id)
);

CREATE INDEX idx_booking_custom_field_answers_custom_field_id ON booking_custom_field_answers (custom_field_id);

-- Forward FK: bookings and custom_fields load after this file alphabetically.
ALTER TABLE booking_custom_field_answers
  ADD CONSTRAINT fk_booking_custom_field_answers_booking
  FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE;

ALTER TABLE booking_custom_field_answers
  ADD CONSTRAINT fk_booking_custom_field_answers_custom_field
  FOREIGN KEY (custom_field_id) REFERENCES custom_fields (id) ON DELETE CASCADE;
