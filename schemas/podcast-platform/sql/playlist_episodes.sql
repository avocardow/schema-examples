-- playlist_episodes: Ordered junction table linking episodes to playlists, preserving the curator-defined playback sequence.
-- See README.md for full design rationale.

CREATE TABLE playlist_episodes (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id  UUID        NOT NULL,
    episode_id   UUID        NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
    position     INTEGER     NOT NULL,
    added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE playlist_episodes
    ADD CONSTRAINT fk_playlist_episodes_playlist_id
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE;

CREATE INDEX idx_playlist_episodes_playlist_id_position ON playlist_episodes (playlist_id, position);
CREATE INDEX idx_playlist_episodes_episode_id ON playlist_episodes (episode_id);
