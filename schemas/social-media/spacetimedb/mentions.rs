// mentions: user mentions within posts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = mentions, public)]
pub struct Mention {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (post_id, mentioned_user_id) — enforce in reducer logic.
    #[index(btree)]
    pub post_id: String, // UUID — FK → posts.id (cascade delete)
    // Composite index: (mentioned_user_id, created_at) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub mentioned_user_id: String, // UUID — FK → users.id (cascade delete)
    pub created_at: Timestamp,
}
