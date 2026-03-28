// playlist_tracks: Ordered track entries within playlists with contributor attribution.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = playlist_tracks, public)]
pub struct PlaylistTrack {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub playlist_id: String, // UUID — FK → playlists.id (cascade delete)
    #[index(btree)]
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    pub added_by: String, // UUID — FK → users.id (cascade delete)
    pub position: i32,
    pub added_at: Timestamp,
}
// Composite index: (playlist_id, position) — not supported; btree on playlist_id covers leading column.
