-- campaign_events: Individual engagement events (opens, clicks, bounces) per send.
-- See README.md for full design rationale.

CREATE TYPE campaign_event_type AS ENUM ('open', 'click', 'bounce', 'complaint', 'unsubscribe');

CREATE TABLE campaign_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    send_id         UUID NOT NULL,
    event_type      campaign_event_type NOT NULL,
    link_id         UUID,
    metadata        JSONB,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaign_events_send_id ON campaign_events (send_id);
CREATE INDEX idx_campaign_events_event_type ON campaign_events (event_type);
CREATE INDEX idx_campaign_events_occurred_at ON campaign_events (occurred_at);

-- Forward FK: campaign_links is defined in campaign_links.sql (loaded after this file).
ALTER TABLE campaign_events ADD CONSTRAINT fk_campaign_events_link_id
  FOREIGN KEY (link_id) REFERENCES campaign_links(id) ON DELETE SET NULL;

-- Forward FK: campaign_sends is defined in campaign_sends.sql (loaded after this file).
ALTER TABLE campaign_events ADD CONSTRAINT fk_campaign_events_send_id
  FOREIGN KEY (send_id) REFERENCES campaign_sends(id) ON DELETE CASCADE;
