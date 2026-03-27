-- clicks: Individual click events tracked against affiliate links.
-- See README.md for full design rationale.

CREATE TABLE clicks (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
    click_id          TEXT UNIQUE NOT NULL,
    ip_address        TEXT,
    user_agent        TEXT,
    referer_url       TEXT,
    landing_url       TEXT,
    country           TEXT,
    device_type       TEXT,
    is_unique         BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clicks_affiliate_link_id_created_at ON clicks(affiliate_link_id, created_at);
CREATE INDEX idx_clicks_created_at ON clicks(created_at);
