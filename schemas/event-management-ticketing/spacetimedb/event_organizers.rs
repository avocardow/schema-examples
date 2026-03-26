// event_organizers: Users assigned to manage or staff an event.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum OrganizerRole {
    Owner, // type: String
    Admin,
    Moderator,
    CheckInStaff,
}

#[spacetimedb::table(name = event_organizers, public)]
pub struct EventOrganizer {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (cascade delete)

    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)

    pub role: OrganizerRole,
    pub created_at: Timestamp,
    // Composite unique: (event_id, user_id)
}
