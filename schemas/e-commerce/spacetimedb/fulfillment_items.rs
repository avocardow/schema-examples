// fulfillment_items: Individual order items included in a fulfillment, tracking shipped quantity.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

// Composite unique: (fulfillment_id, order_item_id) — enforce in reducer logic

#[spacetimedb::table(name = fulfillment_items, public)]
pub struct FulfillmentItem {
    #[primary_key]
    pub id: String, // UUID auto-generated
    pub fulfillment_id: String, // FK → fulfillments.id (cascade delete)
    pub order_item_id: String, // FK → order_items.id (cascade delete)
    pub quantity: i32,
    pub created_at: Timestamp,
}
