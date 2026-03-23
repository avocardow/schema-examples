// pinned_messages: records messages pinned within a conversation, tracking who pinned them and when.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (conversation_id, message_id) — not supported in SpacetimeDB; enforce at application layer.
// Composite index: (conversation_id, pinned_at) — not supported in SpacetimeDB; document only.

#[spacetimedb::table(name = pinned_messages, public)]
pub struct PinnedMessage {
    #[primary_key]
    pub id: String, // UUID

    // FK → conversations.id (cascade delete)
    #[index(btree)]
    pub conversation_id: String, // UUID

    // FK → messages.id (cascade delete)
    pub message_id: String, // UUID

    // FK → users.id (cascade delete)
    pub pinned_by: String, // UUID

    pub pinned_at: Timestamp,
}
