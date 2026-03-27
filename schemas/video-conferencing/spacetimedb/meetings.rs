// meetings: scheduled or ad-hoc video conference sessions within a room.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum MeetingStatus {
    Scheduled, // type: String
    Live,
    Ended,
    Cancelled,
}

// Composite index (room_id, scheduled_start) — not supported in SpacetimeDB

#[spacetimedb::table(name = meetings, public)]
pub struct Meeting {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub room_id: String, // UUID — FK → rooms.id (cascade delete)
    pub title: Option<String>,
    #[index(btree)]
    pub meeting_status: MeetingStatus,
    #[index(btree)]
    pub scheduled_start: Option<Timestamp>,
    pub scheduled_end: Option<Timestamp>,
    #[index(btree)]
    pub actual_start: Option<Timestamp>,
    pub actual_end: Option<Timestamp>,
    pub max_participants: Option<i32>,
    pub enable_waiting_room: Option<bool>,
    #[index(btree)]
    pub host_id: String, // UUID — FK → users.id (restrict delete)
    pub participant_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
