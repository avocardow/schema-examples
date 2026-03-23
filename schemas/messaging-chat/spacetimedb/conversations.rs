// conversations: chat conversations (direct, group, or channel) between users.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ConversationType {
    Direct, // type: String
    Group,
    Channel,
}

#[spacetimedb::table(name = conversations, public)]
pub struct Conversation {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub conversation_type: ConversationType,
    pub name: Option<String>,
    pub description: Option<String>,
    #[unique]
    pub slug: Option<String>,
    // Composite index: (is_private, conversation_type) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub is_private: bool,
    pub is_archived: bool,
    #[index(btree)]
    pub last_message_at: Option<Timestamp>,
    pub message_count: i32,
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
