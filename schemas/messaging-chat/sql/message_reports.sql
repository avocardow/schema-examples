-- message_reports: Tracks user-submitted reports of individual messages for moderation review.
-- See README.md for full design rationale.

CREATE TYPE message_report_reason AS ENUM (
    'spam',
    'harassment',
    'hate_speech',
    'violence',
    'misinformation',
    'nsfw',
    'other'
);

CREATE TYPE message_report_status AS ENUM (
    'pending',
    'reviewed',
    'resolved',
    'dismissed'
);

CREATE TABLE message_reports (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id    UUID          NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    reporter_id   UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reason        message_report_reason NOT NULL,
    description   TEXT,
    status        message_report_status NOT NULL DEFAULT 'pending',
    reviewed_by   UUID          REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_message_reports_message_reporter UNIQUE (message_id, reporter_id)
);

CREATE INDEX idx_message_reports_status      ON message_reports (status);
CREATE INDEX idx_message_reports_reporter_id ON message_reports (reporter_id);
CREATE INDEX idx_message_reports_reviewed_by ON message_reports (reviewed_by);
