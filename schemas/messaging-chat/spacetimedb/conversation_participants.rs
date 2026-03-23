// conversation_participants: membership records linking users to conversations, including role and notification preferences.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ConversationParticipantRole {
    Owner, // type: String

    Admin,
    Moderator,
    Member,
}

#[derive(SpacetimeType, Clone)]
pub enum ConversationNotificationLevel {
    All, // type: String

    Mentions,
    None,
}

#[spacetimedb::table(name = conversation_participants, public)]
pub struct ConversationParticipant {
    #[primary_key]
    pub id: String, // UUID
    // FK → conversations.id (cascade delete)
    #[index(btree)]
    pub conversation_id: String, // UUID
    // FK → users.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID
    pub role: ConversationParticipantRole,
    // Composite unique: (conversation_id, user_id) — not supported in SpacetimeDB; document only.
    // Composite index: (user_id, last_read_at) — not supported in SpacetimeDB; document only.
    pub last_read_at: Option<Timestamp>,
    pub notification_level: Option<ConversationNotificationLevel>,
    pub is_muted: bool,
    pub muted_until: Option<Timestamp>,
    pub joined_at: Timestamp,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
