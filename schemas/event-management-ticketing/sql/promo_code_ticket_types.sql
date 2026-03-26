-- promo_code_ticket_types: Junction table restricting promo codes to specific ticket types.
-- See README.md for full design rationale.

CREATE TABLE promo_code_ticket_types (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id       UUID NOT NULL REFERENCES promo_codes (id) ON DELETE CASCADE,
  ticket_type_id      UUID NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (promo_code_id, ticket_type_id)
);

CREATE INDEX idx_promo_code_ticket_types_ticket_type_id ON promo_code_ticket_types (ticket_type_id);

-- Forward FK: ticket_types loads after this file alphabetically.
ALTER TABLE promo_code_ticket_types
  ADD CONSTRAINT fk_promo_code_ticket_types_ticket_type
  FOREIGN KEY (ticket_type_id) REFERENCES ticket_types (id) ON DELETE CASCADE;
