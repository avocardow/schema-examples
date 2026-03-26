// payout_items: Individual vendor order amounts included in a payout batch.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (payout_id, vendor_order_id)

#[spacetimedb::table(name = payout_items, public)]
pub struct PayoutItem {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub payout_id: String, // UUID, FK -> payouts.id (cascade delete)

    pub vendor_order_id: String, // UUID, FK -> vendor_orders.id (restrict delete)
    pub amount: i32,
    pub commission: i32,
    pub created_at: Timestamp,
}
