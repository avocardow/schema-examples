// saved_albums: Albums saved to a user's personal library.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = saved_albums, public)]
pub struct SavedAlbum {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub album_id: String, // UUID — FK → albums.id (cascade delete)
    pub created_at: Timestamp,
}
// Composite unique: (user_id, album_id) — enforce in reducer logic
