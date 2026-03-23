// posts: user-created posts with support for replies, quotes, and threaded conversations.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PostContentType {
    Text, // type: String
    System,
    Deleted,
}

#[derive(SpacetimeType, Clone)]
pub enum PostVisibility {
    Public, // type: String
    Unlisted,
    FollowersOnly,
    MentionedOnly,
}

#[spacetimedb::table(name = posts, public)]
pub struct Post {
    #[primary_key]
    pub id: String, // UUID
    // Composite index: (author_id, created_at) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub author_id: String, // UUID — FK → users.id (cascade delete)
    pub content: Option<String>,
    pub content_type: PostContentType,
    #[index(btree)]
    pub reply_to_id: Option<String>, // UUID — FK → posts.id (set null on delete)
    // Composite index: (conversation_id, created_at) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub conversation_id: Option<String>, // UUID — FK → posts.id (set null on delete)
    #[index(btree)]
    pub quote_of_id: Option<String>, // UUID — FK → posts.id (set null on delete)
    // Composite index: (visibility, created_at) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub visibility: PostVisibility,
    pub is_edited: bool,
    pub edited_at: Option<Timestamp>,
    #[index(btree)]
    pub expires_at: Option<Timestamp>,
    pub reply_count: i32,
    pub reaction_count: i32,
    pub repost_count: i32,
    pub poll_id: Option<String>, // UUID — FK → polls.id (set null on delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
