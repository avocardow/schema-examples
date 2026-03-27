// breakout_rooms: smaller sub-rooms within a meeting for group discussions.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum BreakoutRoomStatus {
    Pending, // type: String
    Open,
    Closed,
}

// Composite index (meeting_id, position) — not supported in SpacetimeDB
// Composite index (meeting_id, breakout_room_status) — not supported in SpacetimeDB

#[spacetimedb::table(name = breakout_rooms, public)]
pub struct BreakoutRoom {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    pub name: String,
    pub position: i32,
    pub breakout_room_status: BreakoutRoomStatus,
    pub opened_at: Option<Timestamp>,
    pub closed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
