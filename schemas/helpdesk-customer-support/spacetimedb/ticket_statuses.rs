// ticket_statuses: Workflow states a ticket can be in.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_statuses, public)]
pub struct TicketStatus {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    #[index(btree)]
    pub sort_order: i32,
    pub color: Option<String>,
    pub is_closed: bool,
    pub is_default: bool,
    pub description: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
