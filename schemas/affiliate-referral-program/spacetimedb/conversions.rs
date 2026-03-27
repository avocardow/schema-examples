// conversions: Tracks conversion events tied to referrals and affiliates.
// See README.md for full design rationale.
// Composite indexes (not expressible inline):
// - idx_conversions_affiliate_status: (affiliate_id, status)

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ConversionStatus {
    Pending,
    Approved,
    Rejected,
    Reversed,
}

#[spacetimedb::table(name = conversions, public)]
pub struct Conversion {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub referral_id: String, // UUID, FK -> referrals.id (restrict delete)

    #[index(btree)]
    pub affiliate_id: String, // UUID, FK -> affiliates.id (restrict delete)

    #[index(btree)]
    pub external_id: Option<String>,

    pub reference_type: Option<String>,

    pub amount: i32, // default: 0

    pub currency: String,

    #[index(btree)]
    pub status: ConversionStatus, // default: Pending

    pub metadata: Option<String>, // JSON stored as string

    pub approved_at: Option<Timestamp>,

    #[index(btree)]
    pub created_at: Timestamp,

    pub updated_at: Timestamp,
}
