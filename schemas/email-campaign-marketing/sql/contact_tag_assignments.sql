-- contact_tag_assignments: Many-to-many relationship between contacts and tags.
-- See README.md for full design rationale.

CREATE TABLE contact_tag_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id      UUID NOT NULL,
    tag_id          UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (contact_id, tag_id)
);

CREATE INDEX idx_contact_tag_assignments_tag_id ON contact_tag_assignments (tag_id);

-- Forward FK: contacts is defined in contacts.sql (loaded after this file).
ALTER TABLE contact_tag_assignments ADD CONSTRAINT fk_contact_tag_assignments_contact_id
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

-- Forward FK: tags is defined in tags.sql (loaded after this file).
ALTER TABLE contact_tag_assignments ADD CONSTRAINT fk_contact_tag_assignments_tag_id
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
