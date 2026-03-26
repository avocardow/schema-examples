// waitlist_entries: Users waiting for ticket availability on sold-out events.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum WaitlistStatus {
    Waiting, // type: String
    Notified,
    Converted,
    Expired,
    Cancelled,
}

#[spacetimedb::table(name = waitlist_entries, public)]
pub struct WaitlistEntry {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (cascade delete)

    pub ticket_type_id: Option<String>, // UUID — FK → ticket_types.id (cascade delete)

    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (cascade delete)

    pub name: String,
    pub email: String,
    pub quantity: i32,
    pub status: WaitlistStatus,
    pub notified_at: Option<Timestamp>,
    pub expires_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (event_id, ticket_type_id, status)
    // Composite index: (email, status)
    // Composite index: (status, notified_at)
}
