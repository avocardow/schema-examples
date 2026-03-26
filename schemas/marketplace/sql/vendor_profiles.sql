-- vendor_profiles: Public-facing vendor storefront details and policies.
-- See README.md for full design rationale.

CREATE TABLE vendor_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id       UUID UNIQUE NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    display_name    TEXT NOT NULL,
    tagline         TEXT,
    description     TEXT,
    logo_url        TEXT,
    banner_url      TEXT,
    website_url     TEXT,
    social_links    JSONB,
    return_policy   TEXT,
    shipping_policy TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
