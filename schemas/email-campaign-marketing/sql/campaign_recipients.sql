-- campaign_recipients: Audience targeting linking campaigns to lists and segments.
-- See README.md for full design rationale.

CREATE TABLE campaign_recipients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id     UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    list_id         UUID,
    segment_id      UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaign_recipients_campaign_id ON campaign_recipients (campaign_id);
CREATE INDEX idx_campaign_recipients_list_id ON campaign_recipients (list_id);
CREATE INDEX idx_campaign_recipients_segment_id ON campaign_recipients (segment_id);

-- Forward FK: contact_lists is defined in contact_lists.sql (loaded after this file).
ALTER TABLE campaign_recipients ADD CONSTRAINT fk_campaign_recipients_list_id
  FOREIGN KEY (list_id) REFERENCES contact_lists(id) ON DELETE CASCADE;

-- Forward FK: segments is defined in segments.sql (loaded after this file).
ALTER TABLE campaign_recipients ADD CONSTRAINT fk_campaign_recipients_segment_id
  FOREIGN KEY (segment_id) REFERENCES segments(id) ON DELETE CASCADE;
