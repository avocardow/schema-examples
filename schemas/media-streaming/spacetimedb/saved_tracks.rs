// saved_tracks: Tracks saved to a user's personal library.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = saved_tracks, public)]
pub struct SavedTrack {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    pub created_at: Timestamp,
}
// Composite unique: (user_id, track_id) — enforce in reducer logic
// Composite index: (user_id, created_at) — not supported; btree on user_id covers leading column.
