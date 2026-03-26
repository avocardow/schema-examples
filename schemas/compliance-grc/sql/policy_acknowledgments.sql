-- policy_acknowledgments: Records of users acknowledging they have read a policy version.
-- See README.md for full design rationale.

CREATE TYPE acknowledgment_method AS ENUM ('click_through', 'electronic_signature', 'manual');

CREATE TABLE policy_acknowledgments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version_id UUID NOT NULL,
  user_id           UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  acknowledged_at   TIMESTAMPTZ NOT NULL,
  method            acknowledgment_method NOT NULL DEFAULT 'click_through',
  ip_address        TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (policy_version_id, user_id)
);

-- Forward FK: policy_versions loads after policy_acknowledgments alphabetically.
ALTER TABLE policy_acknowledgments
  ADD CONSTRAINT fk_policy_acknowledgments_policy_version
  FOREIGN KEY (policy_version_id) REFERENCES policy_versions (id) ON DELETE CASCADE;

CREATE INDEX idx_policy_acknowledgments_user_id ON policy_acknowledgments (user_id);
CREATE INDEX idx_policy_acknowledgments_acknowledged_at ON policy_acknowledgments (acknowledged_at);
