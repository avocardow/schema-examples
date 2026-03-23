// bookmarks: user-saved posts for later viewing.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = bookmarks, public)]
pub struct Bookmark {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (user_id, post_id) — enforce in reducer logic.
    // Composite index: (user_id, created_at) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub post_id: String, // UUID — FK → posts.id (cascade delete)
    pub created_at: Timestamp,
}
