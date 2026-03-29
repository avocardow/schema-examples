-- asset_downloads: Tracks every file download event for analytics and compliance.
-- See README.md for full design rationale.

CREATE TABLE asset_downloads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id        UUID NOT NULL,
    downloaded_by   UUID,
    share_link_id   UUID,
    preset_id       UUID,
    format          TEXT NOT NULL,
    file_size       BIGINT NOT NULL,
    ip_address      TEXT,
    user_agent      TEXT,
    downloaded_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: assets is defined in assets.sql (loaded after this file).
ALTER TABLE asset_downloads
    ADD CONSTRAINT fk_asset_downloads_asset
    FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE CASCADE;

ALTER TABLE asset_downloads
    ADD CONSTRAINT fk_asset_downloads_downloaded_by
    FOREIGN KEY (downloaded_by) REFERENCES users (id) ON DELETE SET NULL;

-- Forward FK: share_links is defined in share_links.sql (loaded after this file).
ALTER TABLE asset_downloads
    ADD CONSTRAINT fk_asset_downloads_share_link
    FOREIGN KEY (share_link_id) REFERENCES share_links (id) ON DELETE SET NULL;

-- Forward FK: download_presets is defined in download_presets.sql (loaded after this file).
ALTER TABLE asset_downloads
    ADD CONSTRAINT fk_asset_downloads_preset
    FOREIGN KEY (preset_id) REFERENCES download_presets (id) ON DELETE SET NULL;

CREATE INDEX idx_asset_downloads_asset_id ON asset_downloads (asset_id);
CREATE INDEX idx_asset_downloads_downloaded_by ON asset_downloads (downloaded_by);
CREATE INDEX idx_asset_downloads_downloaded_at ON asset_downloads (downloaded_at);
