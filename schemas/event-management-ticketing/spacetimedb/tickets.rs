// tickets: Individual issued tickets tied to an order and event.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum TicketStatus {
    Valid, // type: String
    Used,
    Cancelled,
    Transferred,
    Expired,
}

#[spacetimedb::table(name = tickets, public)]
pub struct Ticket {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub order_item_id: String, // UUID — FK → order_items.id (restrict delete)

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (restrict delete)

    pub ticket_type_id: Option<String>, // UUID — FK → ticket_types.id (set null)

    #[index(btree)]
    pub holder_user_id: Option<String>, // UUID — FK → users.id (set null)

    pub holder_name: String,

    #[index(btree)]
    pub holder_email: String,

    #[unique]
    pub ticket_code: String,

    pub status: TicketStatus,
    pub checked_in_at: Option<Timestamp>,
    pub cancelled_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (event_id, status)
}
