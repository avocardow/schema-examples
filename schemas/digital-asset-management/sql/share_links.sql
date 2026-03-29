-- share_links: Tokenised URLs for sharing assets or collections externally.
-- See README.md for full design rationale.

CREATE TABLE share_links (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL,
    asset_id        UUID REFERENCES assets (id) ON DELETE CASCADE,
    collection_id   UUID REFERENCES collections (id) ON DELETE CASCADE,
    token           TEXT UNIQUE NOT NULL,
    password_hash   TEXT,
    allow_download  BOOLEAN NOT NULL DEFAULT true,
    expires_at      TIMESTAMPTZ,
    view_count      INTEGER NOT NULL DEFAULT 0,
    max_views       INTEGER,
    created_by      UUID NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE share_links
    ADD CONSTRAINT fk_share_links_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

ALTER TABLE share_links
    ADD CONSTRAINT fk_share_links_created_by
    FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE;

CREATE INDEX idx_share_links_workspace_id ON share_links (workspace_id);
CREATE INDEX idx_share_links_asset_id ON share_links (asset_id);
CREATE INDEX idx_share_links_collection_id ON share_links (collection_id);
CREATE INDEX idx_share_links_expires_at ON share_links (expires_at);
