-- ticket_tags: Join table linking tickets to tags.
-- See README.md for full design rationale.

CREATE TABLE ticket_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id  UUID NOT NULL,
  tag_id     UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (ticket_id, tag_id)
);

-- Forward FK: tickets loads after ticket_tags alphabetically.
ALTER TABLE ticket_tags
  ADD CONSTRAINT fk_ticket_tags_ticket
  FOREIGN KEY (ticket_id) REFERENCES tickets (id) ON DELETE CASCADE;

CREATE INDEX idx_ticket_tags_tag_id ON ticket_tags (tag_id);
