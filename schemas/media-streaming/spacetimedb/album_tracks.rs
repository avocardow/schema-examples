// album_tracks: Track listings within albums with disc and position ordering.
// See README.md for full design rationale.

#[spacetimedb::table(name = album_tracks, public)]
pub struct AlbumTrack {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub album_id: String, // UUID — FK → albums.id (cascade delete)
    #[index(btree)]
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    pub disc_number: i32,
    pub position: i32,
}
// Composite unique: (album_id, disc_number, position) — enforce in reducer logic
