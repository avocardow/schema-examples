// ticket_tags: Many-to-many association between tickets and tags.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_tags, public)]
pub struct TicketTag {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)
    #[index(btree)]
    pub tag_id: String, // UUID — FK → tags.id (cascade delete)
    // Composite unique: (ticket_id, tag_id) — not supported inline, enforce in application
    pub created_at: Timestamp,
}
