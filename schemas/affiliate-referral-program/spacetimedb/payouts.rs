// payouts: Tracks affiliate payout requests and their lifecycle.
// Each payout has a unique payout_number and progresses through status states.
// Composite index: (affiliate_id, status)

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PayoutStatus {
    Pending,
    Processing,
    Completed,
    Failed,
    Canceled,
}

#[spacetimedb::table(name = payouts, public)]
pub struct Payout {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub affiliate_id: String, // UUID, FK -> affiliates.id (restrict delete)

    #[unique]
    pub payout_number: String,

    #[index(btree)]
    pub status: PayoutStatus, // default: Pending

    pub currency: String,
    pub amount: i32,
    pub fee: i32, // default: 0
    pub net_amount: i32,

    pub payout_method: Option<String>,
    pub provider_id: Option<String>,
    pub note: Option<String>,

    pub completed_at: Option<Timestamp>,

    #[index(btree)]
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
