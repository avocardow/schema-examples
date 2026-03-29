-- asset_licenses: Links assets to their applicable license terms and date ranges.
-- See README.md for full design rationale.

CREATE TABLE asset_licenses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id        UUID NOT NULL,
    license_id      UUID NOT NULL,
    effective_date  TEXT NOT NULL,
    expiry_date     TEXT,
    notes           TEXT,
    assigned_by     UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: assets is defined in assets.sql (loaded after this file).
ALTER TABLE asset_licenses
    ADD CONSTRAINT fk_asset_licenses_asset
    FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE CASCADE;

-- Forward FK: licenses is defined in licenses.sql (loaded after this file).
ALTER TABLE asset_licenses
    ADD CONSTRAINT fk_asset_licenses_license
    FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE CASCADE;

ALTER TABLE asset_licenses
    ADD CONSTRAINT fk_asset_licenses_assigned_by
    FOREIGN KEY (assigned_by) REFERENCES users (id) ON DELETE RESTRICT;

CREATE INDEX idx_asset_licenses_asset_id ON asset_licenses (asset_id);
CREATE INDEX idx_asset_licenses_license_id ON asset_licenses (license_id);
CREATE INDEX idx_asset_licenses_expiry_date ON asset_licenses (expiry_date);
