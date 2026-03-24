-- deal_tags: Join table linking deals to tags.
-- See README.md for full design rationale.

CREATE TABLE deal_tags (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL,
  tag_id  UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (deal_id, tag_id)
);

-- Forward FKs: deals and tags both load after deal_tags alphabetically.
ALTER TABLE deal_tags
  ADD CONSTRAINT fk_deal_tags_deal
  FOREIGN KEY (deal_id) REFERENCES deals (id) ON DELETE CASCADE;

ALTER TABLE deal_tags
  ADD CONSTRAINT fk_deal_tags_tag
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE;

CREATE INDEX idx_deal_tags_tag_id ON deal_tags (tag_id);
