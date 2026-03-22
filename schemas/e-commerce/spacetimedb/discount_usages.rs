// discount_usages: Tracks each application of a discount to an order, enforcing one-use-per-order.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = discount_usages, public)]
pub struct DiscountUsage {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub discount_id: String, // FK → discounts.id (cascade delete); composite unique: (discount_id, order_id); composite index: (discount_id, user_id)

    #[index(btree)]
    pub order_id: String, // FK → orders.id (cascade delete)

    pub user_id: Option<String>, // FK → users.id (set null on delete)

    pub created_at: Timestamp,
}
