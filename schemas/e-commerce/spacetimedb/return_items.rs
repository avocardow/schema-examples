// return_items: Individual line items within a return authorization, tracking quantity and condition of returned products.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ReturnItemCondition {
    Unopened, // type: String
    LikeNew,
    Used,
    Damaged,
    Defective,
}

// Unique constraint: (return_authorization_id, order_item_id)
#[spacetimedb::table(name = return_items, public)]
pub struct ReturnItem {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    pub return_authorization_id: String, // FK → return_authorizations.id (cascade delete)

    pub order_item_id: String, // FK → order_items.id (cascade delete)

    pub quantity: i32, // not null

    pub reason: Option<String>,

    pub condition: Option<ReturnItemCondition>,

    pub received_quantity: i32, // not null, default: 0

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
