// playlist_followers: Users following playlists for updates and recommendations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = playlist_followers, public)]
pub struct PlaylistFollower {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub playlist_id: String, // UUID — FK → playlists.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub created_at: Timestamp,
}
// Composite unique: (playlist_id, user_id) — enforce in reducer logic
// Composite index: (user_id, created_at) — not supported; btree on user_id covers leading column.
