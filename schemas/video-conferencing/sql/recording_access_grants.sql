-- recording_access_grants: Per-user permission grants for accessing recordings.
-- See README.md for full design rationale and field documentation.

CREATE TYPE recording_permission AS ENUM ('view', 'download');

CREATE TABLE recording_access_grants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id  UUID NOT NULL REFERENCES recordings (id) ON DELETE CASCADE,
  granted_to    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  granted_by    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  permission    recording_permission NOT NULL DEFAULT 'view',
  expires_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (recording_id, granted_to)
);

CREATE INDEX idx_recording_access_grants_granted_to ON recording_access_grants (granted_to);
