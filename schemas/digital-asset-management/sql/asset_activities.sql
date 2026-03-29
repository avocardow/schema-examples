-- asset_activities: Audit log of all actions performed on assets within a workspace.
-- See README.md for full design rationale.

CREATE TYPE asset_activity_action AS ENUM (
    'uploaded',
    'updated',
    'downloaded',
    'shared',
    'commented',
    'tagged',
    'moved',
    'versioned',
    'archived',
    'restored',
    'deleted'
);

CREATE TABLE asset_activities (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id  UUID NOT NULL,
    asset_id      UUID,
    actor_id      UUID NOT NULL,
    action        asset_activity_action NOT NULL,
    details       JSONB,
    occurred_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Forward FK: workspaces is defined in workspaces.sql (loaded after this file).
ALTER TABLE asset_activities
    ADD CONSTRAINT fk_asset_activities_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE;

-- Forward FK: assets is defined in assets.sql (loaded after this file).
ALTER TABLE asset_activities
    ADD CONSTRAINT fk_asset_activities_asset
    FOREIGN KEY (asset_id) REFERENCES assets (id) ON DELETE SET NULL;

ALTER TABLE asset_activities
    ADD CONSTRAINT fk_asset_activities_actor
    FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE RESTRICT;

CREATE INDEX idx_asset_activities_workspace_id ON asset_activities (workspace_id);
CREATE INDEX idx_asset_activities_asset_id ON asset_activities (asset_id);
CREATE INDEX idx_asset_activities_actor_id ON asset_activities (actor_id);
CREATE INDEX idx_asset_activities_action ON asset_activities (action);
CREATE INDEX idx_asset_activities_occurred_at ON asset_activities (occurred_at);
