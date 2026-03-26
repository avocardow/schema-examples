// disputes: Customer-initiated disputes against vendor orders.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DisputeReason {
    NotReceived,
    NotAsDescribed,
    Defective,
    WrongItem,
    Unauthorized,
    Other,
}

#[derive(SpacetimeType, Clone)]
pub enum DisputeStatus {
    Open,
    UnderReview,
    Escalated,
    ResolvedCustomer,
    ResolvedVendor,
    Closed,
}

// Composite index: (vendor_id, status)

#[spacetimedb::table(name = disputes, public)]
pub struct Dispute {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_order_id: String, // UUID, FK -> vendor_orders.id (restrict delete)

    #[index(btree)]
    pub customer_id: String, // UUID, FK -> users.id (restrict delete)

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (restrict delete)

    pub reason: DisputeReason,
    #[index(btree)]
    pub status: DisputeStatus,
    pub description: String,
    pub resolution_note: Option<String>,
    pub refund_amount: Option<i32>,
    pub currency: String,
    pub resolved_by: Option<String>, // UUID, FK -> users.id (set null)
    pub resolved_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
