// post_reactions: Emoji-style user reactions on posts.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ReactionType {
    Like,       // type: String
    Love,
    Clap,
    Insightful,
    Bookmark,
}

#[spacetimedb::table(name = post_reactions, public)]
pub struct PostReaction {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // FK -> users.id (cascade delete)
    pub reaction_type: ReactionType, // Composite unique: (post_id, user_id, reaction_type)
    // Composite index: (post_id, reaction_type)
    pub created_at: Timestamp,
}
