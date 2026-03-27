// meeting_chat_messages: text messages sent during a live meeting.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index (meeting_id, created_at) — not supported in SpacetimeDB

#[spacetimedb::table(name = meeting_chat_messages, public)]
pub struct MeetingChatMessage {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    #[index(btree)]
    pub sender_id: Option<String>, // UUID — FK → users.id (set null on delete)
    pub recipient_id: Option<String>, // UUID — FK → users.id (set null on delete)
    pub content: String,
    pub created_at: Timestamp,
}
