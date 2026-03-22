// refunds: Tracks refund requests and outcomes against payments and orders.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum RefundStatus {
    Pending, // type: String
    Succeeded,
    Failed,
}

#[spacetimedb::table(name = refunds, public)]
pub struct Refund {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub payment_id: String, // FK → payments.id (restrict delete)

    #[index(btree)]
    pub order_id: String, // FK → orders.id (restrict delete)

    pub provider_id: Option<String>,

    pub amount: i32,      // not null
    pub currency: String, // not null

    pub reason: Option<String>,

    #[index(btree)]
    pub status: RefundStatus, // not null, default: Pending

    pub note: Option<String>,

    pub refunded_by: Option<String>, // FK → users.id (set null on delete)

    pub created_at: Timestamp,
}
