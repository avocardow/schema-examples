// payouts: Scheduled or completed disbursements of vendor earnings.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum PayoutStatus {
    Pending,
    Processing,
    Completed,
    Failed,
    Canceled,
}

// Composite index: (vendor_id, status)

#[spacetimedb::table(name = payouts, public)]
pub struct Payout {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (restrict delete)

    #[unique]
    pub payout_number: String,

    #[index(btree)]
    pub status: PayoutStatus,
    pub currency: String,
    pub amount: i32,
    pub fee: i32,
    pub net_amount: i32,
    pub provider: Option<String>,
    pub provider_id: Option<String>,
    pub period_start: Timestamp,
    pub period_end: Timestamp,
    pub note: Option<String>,
    pub completed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
