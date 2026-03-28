-- distribution_targets: Tracks the submission and approval status of a podcast show on external distribution platforms.
-- See README.md for full design rationale.

CREATE TYPE distribution_status_enum AS ENUM ('pending', 'active', 'rejected', 'suspended');

CREATE TABLE distribution_targets (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id           UUID NOT NULL,
    platform          TEXT NOT NULL,
    external_id       TEXT,
    status            distribution_status_enum NOT NULL DEFAULT 'pending',
    feed_url_override TEXT,
    submitted_at      TIMESTAMPTZ,
    approved_at       TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE distribution_targets
    ADD CONSTRAINT fk_distribution_targets_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

CREATE INDEX idx_distribution_targets_show_id_platform ON distribution_targets (show_id, platform);
CREATE INDEX idx_distribution_targets_status ON distribution_targets (status);
