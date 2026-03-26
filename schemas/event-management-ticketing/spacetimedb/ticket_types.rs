// ticket_types: Purchasable ticket tiers for an event with pricing and availability.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_types, public)]
pub struct TicketType {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // UUID — FK → events.id (cascade delete)

    pub name: String,
    pub description: Option<String>,
    pub price: i64, // stored in smallest currency unit (e.g. cents)
    pub currency: String,
    pub quantity_total: Option<i32>,
    pub quantity_sold: i32,
    pub min_per_order: i32,
    pub max_per_order: i32,
    pub sale_start_at: Option<Timestamp>,
    pub sale_end_at: Option<Timestamp>,
    pub is_active: bool,
    pub is_hidden: bool,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (event_id, position)
    // Composite index: (event_id, is_active)
}
