-- compliance_taggables: Polymorphic join linking tags to controls, risks, policies, etc.
-- See README.md for full design rationale.

CREATE TYPE taggable_type AS ENUM ('control', 'risk', 'policy', 'audit', 'finding', 'evidence');

CREATE TABLE compliance_taggables (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id        UUID NOT NULL REFERENCES compliance_tags (id) ON DELETE CASCADE,
  taggable_type taggable_type NOT NULL,
  taggable_id   UUID NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (tag_id, taggable_type, taggable_id)
);

CREATE INDEX idx_compliance_taggables_taggable_type ON compliance_taggables (taggable_type);
CREATE INDEX idx_compliance_taggables_taggable_id ON compliance_taggables (taggable_id);
