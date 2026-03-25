// ticket_followers: Users subscribed to ticket updates.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_followers, public)]
pub struct TicketFollower {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    // Composite unique: (ticket_id, user_id) — not supported inline, enforce in application
    pub created_at: Timestamp,
}
