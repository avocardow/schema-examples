-- templates: Reusable email templates with subject, body, and sender defaults.
-- See README.md for full design rationale.

CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    subject         TEXT,
    html_body       TEXT,
    text_body       TEXT,
    from_name       TEXT,
    from_email      TEXT,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_templates_created_by ON templates (created_by);
