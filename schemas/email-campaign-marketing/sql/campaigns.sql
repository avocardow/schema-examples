-- campaigns: Email campaigns with scheduling, A/B testing, and delivery configuration.
-- See README.md for full design rationale.

CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'paused', 'cancelled', 'sent');
CREATE TYPE campaign_type AS ENUM ('regular', 'ab_test');
CREATE TYPE ab_test_metric AS ENUM ('open_rate', 'click_rate');

CREATE TABLE campaigns (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              TEXT NOT NULL,
    subject           TEXT,
    from_name         TEXT,
    from_email        TEXT,
    reply_to          TEXT,
    template_id       UUID,
    html_body         TEXT,
    text_body         TEXT,
    status            campaign_status NOT NULL DEFAULT 'draft',
    campaign_type     campaign_type NOT NULL DEFAULT 'regular',
    scheduled_at      TIMESTAMPTZ,
    sent_at           TIMESTAMPTZ,
    ab_test_winner_id UUID,
    ab_test_sample_pct INTEGER,
    ab_test_metric    ab_test_metric,
    created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_campaigns_status ON campaigns (status);
CREATE INDEX idx_campaigns_campaign_type ON campaigns (campaign_type);
CREATE INDEX idx_campaigns_template_id ON campaigns (template_id);
CREATE INDEX idx_campaigns_scheduled_at ON campaigns (scheduled_at);
CREATE INDEX idx_campaigns_created_at ON campaigns (created_at);

-- Forward FK: templates is defined in templates.sql (loaded after this file).
ALTER TABLE campaigns ADD CONSTRAINT fk_campaigns_template_id
  FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE SET NULL;
