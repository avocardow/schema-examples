-- campaign_links: Tracked URLs embedded in campaign emails for click analytics.
-- See README.md for full design rationale.

CREATE TABLE campaign_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id     UUID NOT NULL,
    original_url    TEXT NOT NULL,
    position        INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (campaign_id, original_url)
);

-- Forward FK: campaigns is defined in campaigns.sql (loaded after this file).
ALTER TABLE campaign_links ADD CONSTRAINT fk_campaign_links_campaign_id
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE;
