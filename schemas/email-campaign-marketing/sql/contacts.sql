-- contacts: Email recipients with subscription status and custom metadata.
-- See README.md for full design rationale.

CREATE TYPE contact_status AS ENUM ('active', 'unsubscribed', 'bounced', 'complained');

CREATE TABLE contacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE NOT NULL,
    first_name      TEXT,
    last_name       TEXT,
    status          contact_status NOT NULL DEFAULT 'active',
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_status ON contacts (status);
CREATE INDEX idx_contacts_created_at ON contacts (created_at);
