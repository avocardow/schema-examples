-- company_tags: Join table linking companies to tags.
-- See README.md for full design rationale.

CREATE TABLE company_tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies (id) ON DELETE CASCADE,
  tag_id     UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, tag_id)
);

-- Forward FK: tags loads after company_tags alphabetically.
ALTER TABLE company_tags
  ADD CONSTRAINT fk_company_tags_tag
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE;

CREATE INDEX idx_company_tags_tag_id ON company_tags (tag_id);
