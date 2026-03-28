-- subscriptions: Tracks a user's subscription to a podcast show, including per-show playback and notification preferences.
-- See README.md for full design rationale.

CREATE TYPE new_episode_sort_enum AS ENUM ('newest_first', 'oldest_first');

CREATE TABLE subscriptions (
    id                      UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID             NOT NULL,
    show_id                 UUID             NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    auto_download           BOOLEAN          NOT NULL DEFAULT false,
    download_wifi_only      BOOLEAN          NOT NULL DEFAULT true,
    notifications_enabled   BOOLEAN          NOT NULL DEFAULT true,
    custom_playback_speed   NUMERIC,
    new_episode_sort        new_episode_sort_enum NOT NULL DEFAULT 'newest_first',
    created_at              TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, show_id)
);

ALTER TABLE subscriptions
    ADD CONSTRAINT fk_subscriptions_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_subscriptions_show_id ON subscriptions (show_id);
