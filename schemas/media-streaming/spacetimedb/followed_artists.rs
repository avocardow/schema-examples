// followed_artists: Artists followed by users for updates and recommendations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = followed_artists, public)]
pub struct FollowedArtist {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub artist_id: String, // UUID — FK → artists.id (cascade delete)
    pub created_at: Timestamp,
}
// Composite unique: (user_id, artist_id) — enforce in reducer logic
