-- contact_tags: Join table linking contacts to tags.
-- See README.md for full design rationale.

CREATE TABLE contact_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL,
  tag_id     UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (contact_id, tag_id)
);

-- Forward FKs: contacts and tags both load after contact_tags alphabetically.
ALTER TABLE contact_tags
  ADD CONSTRAINT fk_contact_tags_contact
  FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE;

ALTER TABLE contact_tags
  ADD CONSTRAINT fk_contact_tags_tag
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE;

CREATE INDEX idx_contact_tags_tag_id ON contact_tags (tag_id);
