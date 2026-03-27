-- suppression_entries: Global suppression list preventing emails to blocked addresses.
-- See README.md for full design rationale.

CREATE TYPE suppression_reason AS ENUM ('hard_bounce', 'complaint', 'manual', 'list_unsubscribe');

CREATE TABLE suppression_entries (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               TEXT UNIQUE NOT NULL,
    reason              suppression_reason NOT NULL,
    source_campaign_id  UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    created_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_suppression_entries_reason ON suppression_entries (reason);
