// messages: individual messages within a conversation, supporting threads and expiry.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ContentType {
    Text, // type: String

    System,
    Deleted,
}

#[spacetimedb::table(name = messages, public)]
pub struct Message {
    #[primary_key]
    pub id: String, // UUID
    // Composite index: (conversation_id, created_at) — not supported in SpacetimeDB; document only.
    // Composite index: (conversation_id, parent_message_id) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub conversation_id: String, // UUID, FK → conversations.id (cascade delete)
    #[index(btree)]
    pub sender_id: Option<String>, // UUID, FK → users.id (set null on delete)
    pub content: Option<String>,
    pub content_type: ContentType,
    #[index(btree)]
    pub parent_message_id: Option<String>, // UUID, FK → messages.id (self-reference, set null on delete)
    pub reply_count: i32,
    pub last_reply_at: Option<Timestamp>,
    pub is_edited: bool,
    pub edited_at: Option<Timestamp>,
    #[index(btree)]
    pub expires_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
