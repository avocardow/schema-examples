-- campaign_sends: Per-contact delivery records for each campaign send.
-- See README.md for full design rationale.

CREATE TYPE campaign_send_status AS ENUM ('queued', 'sent', 'delivered', 'bounced', 'dropped', 'deferred');

CREATE TABLE campaign_sends (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id      UUID NOT NULL,
    status          campaign_send_status NOT NULL DEFAULT 'queued',
    sent_at         TIMESTAMPTZ,
    delivered_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (campaign_id, contact_id)
);

CREATE INDEX idx_campaign_sends_contact_id ON campaign_sends (contact_id);
CREATE INDEX idx_campaign_sends_status ON campaign_sends (status);
CREATE INDEX idx_campaign_sends_sent_at ON campaign_sends (sent_at);

-- Forward FK: contacts is defined in contacts.sql (loaded after this file).
ALTER TABLE campaign_sends ADD CONSTRAINT fk_campaign_sends_contact_id
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;
