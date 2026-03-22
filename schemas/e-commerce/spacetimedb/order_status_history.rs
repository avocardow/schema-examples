// order_status_history: Records each status transition for an order, providing a full audit trail.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = order_status_history, public)]
pub struct OrderStatusHistory {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub order_id: String, // FK → orders.id (cascade delete); composite index: (order_id, created_at)

    pub from_status: Option<String>,

    pub to_status: String,

    pub changed_by: Option<String>, // FK → users.id (set null on delete)

    pub note: Option<String>,

    pub created_at: Timestamp,
}
