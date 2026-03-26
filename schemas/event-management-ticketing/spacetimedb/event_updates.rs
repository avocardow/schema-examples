// event_updates: Announcements and updates posted to event attendees.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = event_updates, public)]
pub struct EventUpdate {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (cascade delete)

    #[index(btree)]
    pub author_id: String, // UUID — FK → users.id (restrict delete)

    pub title: String,
    pub body: String,
    pub is_published: bool,
    pub is_pinned: bool,
    pub published_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (event_id, is_published, published_at)
}
