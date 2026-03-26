// check_ins: Records of ticket holders checking in to events or sessions.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum CheckInMethod {
    QrScan, // type: String
    Manual,
    SelfService,
    Auto,
}

#[spacetimedb::table(name = check_ins, public)]
pub struct CheckIn {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)

    pub session_id: Option<String>, // UUID — FK → event_sessions.id (set null)

    pub checked_in_by: Option<String>, // UUID — FK → users.id (set null)

    pub method: CheckInMethod,
    pub checked_in_at: Timestamp,
    // Composite index: (session_id, checked_in_at)
}
