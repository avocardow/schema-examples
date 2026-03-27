// waiting_room_entries: users waiting to be admitted into a meeting.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum WaitingRoomStatus {
    Waiting, // type: String
    Admitted,
    Rejected,
}

// Composite index (meeting_id, waiting_room_status) — not supported in SpacetimeDB

#[spacetimedb::table(name = waiting_room_entries, public)]
pub struct WaitingRoomEntry {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    pub user_id: Option<String>, // UUID — FK → users.id (cascade delete)
    pub display_name: String,
    pub waiting_room_status: WaitingRoomStatus,
    pub admitted_by: Option<String>, // UUID — FK → users.id (set null on delete)
    pub responded_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
