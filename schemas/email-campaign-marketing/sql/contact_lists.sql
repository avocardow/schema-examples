-- contact_lists: Named mailing lists for organizing and targeting contacts.
-- See README.md for full design rationale.

CREATE TABLE contact_lists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    description     TEXT,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_lists_created_by ON contact_lists (created_by);
