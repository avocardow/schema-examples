// playlists: User-created or collaborative playlists for organizing tracks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = playlists, public)]
pub struct Playlist {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub owner_id: String, // UUID — FK → users.id (cascade delete)
    pub name: String,
    pub description: Option<String>,
    pub cover_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub is_public: bool,
    pub is_collaborative: bool,
    pub track_count: i32,
    pub follower_count: i32,
    pub total_duration_ms: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite index: (owner_id, created_at) — not supported; btree on owner_id covers leading column.
// Composite index: (is_public, follower_count) — not supported in SpacetimeDB; document only.
