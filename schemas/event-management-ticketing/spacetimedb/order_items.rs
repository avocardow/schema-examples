// order_items: Individual line items within a ticket order.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = order_items, public)]
pub struct OrderItem {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub order_id: String, // UUID — FK → orders.id (cascade delete)

    #[index(btree)]
    pub ticket_type_id: Option<String>, // UUID — FK → ticket_types.id (set null)

    pub ticket_type_name: String,
    pub unit_price: i64, // stored in smallest currency unit (e.g. cents)
    pub quantity: i32,
    pub subtotal: i64, // stored in smallest currency unit (e.g. cents)
    pub currency: String,
    pub created_at: Timestamp,
}
