-- booking_services: Links bookings to specific services and optional add-ons with pricing snapshots.
-- See README.md for full design rationale.

CREATE TABLE booking_services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID NOT NULL,
  service_id      UUID,
  addon_id        UUID,
  service_name    TEXT NOT NULL,
  duration        INTEGER NOT NULL,
  price           NUMERIC,
  currency        TEXT,
  is_primary      BOOLEAN NOT NULL DEFAULT TRUE,
  position        INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_services_booking_id ON booking_services (booking_id);
CREATE INDEX idx_booking_services_service_id ON booking_services (service_id);

-- Forward FK: bookings, services, and service_addons load after this file alphabetically.
ALTER TABLE booking_services
  ADD CONSTRAINT fk_booking_services_booking
  FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE;

ALTER TABLE booking_services
  ADD CONSTRAINT fk_booking_services_service
  FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE SET NULL;

ALTER TABLE booking_services
  ADD CONSTRAINT fk_booking_services_addon
  FOREIGN KEY (addon_id) REFERENCES service_addons (id) ON DELETE SET NULL;
