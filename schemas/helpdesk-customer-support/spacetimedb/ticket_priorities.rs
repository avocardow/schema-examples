// ticket_priorities: Urgency levels for tickets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_priorities, public)]
pub struct TicketPriority {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    #[index(btree)]
    pub sort_order: i32,
    pub color: Option<String>,
    pub is_default: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
