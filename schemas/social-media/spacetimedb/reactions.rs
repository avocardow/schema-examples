// reactions: user reactions (like, love, etc.) on posts.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ReactionType {
    Like, // type: String
    Love,
    Celebrate,
    Insightful,
    Funny,
}

#[spacetimedb::table(name = reactions, public)]
pub struct Reaction {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (post_id, user_id, type) — enforce in reducer logic.
    #[index(btree)]
    pub post_id: String, // UUID — FK → posts.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub r#type: ReactionType,
    pub created_at: Timestamp,
}
