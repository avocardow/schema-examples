// commissions: Tracks commission earnings per conversion for affiliates.
// Uses CommissionType from programs.rs — do not redefine here.
// Composite index: (affiliate_id, status)
// Composite index: (program_id, status)

use spacetimedb::{SpacetimeType, Timestamp};
use crate::CommissionType;

#[derive(SpacetimeType, Clone)]
pub enum CommissionStatus {
    Pending,
    Approved,
    Paid,
    Voided,
}

#[spacetimedb::table(name = commissions, public)]
pub struct Commission {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub conversion_id: String, // UUID, FK -> conversions.id (restrict delete)

    #[index(btree)]
    pub affiliate_id: String, // UUID, FK -> affiliates.id (restrict delete)

    #[index(btree)]
    pub program_id: String, // UUID, FK -> programs.id (restrict delete)

    pub amount: i32,
    pub currency: String,

    #[index(btree)]
    pub status: CommissionStatus, // default: Pending

    pub commission_type: CommissionType,
    pub commission_rate: Option<f64>,
    pub commission_flat: Option<i32>,

    pub tier_level: i32, // default: 1

    pub approved_at: Option<Timestamp>,
    pub paid_at: Option<Timestamp>,
    pub voided_at: Option<Timestamp>,
    pub voided_reason: Option<String>,

    #[index(btree)]
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
