-- member_activities: Log of member actions that may trigger earning rules.
-- See README.md for full design rationale.

CREATE TABLE member_activities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id       UUID NOT NULL REFERENCES loyalty_members(id) ON DELETE CASCADE,
    activity_type   TEXT NOT NULL,
    description     TEXT,
    source          TEXT,
    reference_type  TEXT,
    reference_id    TEXT,
    monetary_value  INTEGER,
    currency        TEXT,
    points_awarded  INTEGER,
    transaction_id  UUID,
    metadata        JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: points_transactions is defined in points_transactions.sql (loaded after member_activities.sql).
ALTER TABLE member_activities ADD CONSTRAINT fk_member_activities_transaction_id
    FOREIGN KEY (transaction_id) REFERENCES points_transactions(id) ON DELETE SET NULL;

CREATE INDEX idx_member_activities_member_id_created_at ON member_activities(member_id, created_at);
CREATE INDEX idx_member_activities_activity_type ON member_activities(activity_type);
CREATE INDEX idx_member_activities_reference ON member_activities(reference_type, reference_id);
CREATE INDEX idx_member_activities_transaction_id ON member_activities(transaction_id);
