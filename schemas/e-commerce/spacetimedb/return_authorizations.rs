// return_authorizations: RMA tracking for order returns with approval workflow and refund resolution.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ReturnAuthorizationStatus {
    Requested, // type: String
    Approved,
    Rejected,
    Received,
    Refunded,
    Canceled,
}

#[spacetimedb::table(name = return_authorizations, public)]
pub struct ReturnAuthorization {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub order_id: String, // FK → orders.id (restrict delete)

    #[unique]
    pub rma_number: String, // not null

    #[index(btree)]
    pub status: ReturnAuthorizationStatus, // not null, default: Requested

    pub reason: Option<String>,
    pub note: Option<String>,

    pub refund_amount: Option<i32>,
    pub currency: String, // not null

    pub requested_by: Option<String>, // FK → users.id (set null on delete)
    pub approved_by: Option<String>,  // FK → users.id (set null on delete)

    pub received_at: Option<Timestamp>,

    #[index(btree)]
    pub created_at: Timestamp,

    pub updated_at: Timestamp,
}
