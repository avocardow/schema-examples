// follows: follower-following relationships between users.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = follows, public)]
pub struct Follow {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (follower_id, following_id) — enforce in reducer logic.
    #[index(btree)]
    pub follower_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub following_id: String, // UUID — FK → users.id (cascade delete)
    pub notify: bool,
    pub show_reposts: bool,
    pub created_at: Timestamp,
}
