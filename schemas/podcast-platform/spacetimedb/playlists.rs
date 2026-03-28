// playlists: User-created collections of episodes, either manual or smart-filtered.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PlaylistType {
    Manual, // type: String
    Smart,
}

#[spacetimedb::table(name = playlists, public)]
pub struct Playlist {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub name: String,
    pub description: Option<String>,
    pub playlist_type: PlaylistType,
    pub smart_filters: Option<String>, // JSON stored as string
    pub is_public: bool,
    pub episode_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite index: (user_id, created_at) — not supported, enforce in reducer logic
