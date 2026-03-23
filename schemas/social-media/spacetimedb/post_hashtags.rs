// post_hashtags: many-to-many relationship between posts and hashtags.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = post_hashtags, public)]
pub struct PostHashtag {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (post_id, hashtag_id) — enforce in reducer logic.
    #[index(btree)]
    pub post_id: String, // UUID — FK → posts.id (cascade delete)
    // Composite index: (hashtag_id, created_at) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub hashtag_id: String, // UUID — FK → hashtags.id (cascade delete)
    pub created_at: Timestamp,
}
