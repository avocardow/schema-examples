-- provider_services: Links providers to the services they offer with optional custom pricing.
-- See README.md for full design rationale.

CREATE TABLE provider_services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     UUID NOT NULL,
  service_id      UUID NOT NULL,
  custom_price    NUMERIC,
  custom_duration INTEGER,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (provider_id, service_id)
);

CREATE INDEX idx_provider_services_service_id ON provider_services (service_id);

-- Forward FK: providers and services load after this file alphabetically.
ALTER TABLE provider_services
  ADD CONSTRAINT fk_provider_services_provider
  FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE;

ALTER TABLE provider_services
  ADD CONSTRAINT fk_provider_services_service
  FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE CASCADE;
