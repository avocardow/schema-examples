// event_sessions: Individual sessions or time slots within an event.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum SessionStatus {
    Scheduled, // type: String
    Cancelled,
    Rescheduled,
}

#[spacetimedb::table(name = event_sessions, public)]
pub struct EventSession {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (cascade delete)

    pub venue_id: Option<String>, // UUID — FK → venues.id (set null)

    pub title: String,
    pub description: Option<String>,
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub track: Option<String>,
    pub max_attendees: Option<i32>,
    pub position: i32,
    pub status: SessionStatus,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (event_id, start_time)
    // Composite index: (event_id, track)
}
