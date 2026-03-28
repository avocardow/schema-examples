// playlist_episodes: Ordered episodes within a playlist.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = playlist_episodes, public)]
pub struct PlaylistEpisode {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub playlist_id: String, // UUID — FK → playlists.id (cascade delete)
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub position: i32,
    pub added_at: Timestamp,
}
// Composite index: (playlist_id, position) — not supported, enforce in reducer logic
