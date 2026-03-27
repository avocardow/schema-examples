// meeting_reactions: emoji reactions sent by participants during a meeting.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index (meeting_id, created_at) — not supported in SpacetimeDB
// Composite index (meeting_id, emoji) — not supported in SpacetimeDB

#[spacetimedb::table(name = meeting_reactions, public)]
pub struct MeetingReaction {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub emoji: String,
    pub created_at: Timestamp,
}
