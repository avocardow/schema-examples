// affiliates: Represents a user enrolled in an affiliate/referral program.
// Each affiliate has a unique referral code and optional custom commission settings.
// Composite unique: (program_id, user_id) — enforce in reducer logic

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum AffiliateStatus {
    Pending,
    Active,
    Suspended,
    Rejected,
}

#[spacetimedb::table(name = affiliates, public)]
pub struct Affiliate {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub program_id: String, // UUID, FK -> programs.id (cascade delete)

    #[index(btree)]
    pub user_id: String, // UUID, FK -> users.id (cascade delete)

    #[unique]
    pub referral_code: String,

    pub coupon_code: Option<String>,

    #[index(btree)]
    pub status: AffiliateStatus, // default: Pending

    pub custom_commission_rate: Option<f64>, // decimal

    pub payout_method: Option<String>,
    pub payout_email: Option<String>,

    pub metadata: Option<String>, // JSON stored as string, default: "{}"

    #[index(btree)]
    pub referred_by: Option<String>, // UUID, FK -> affiliates.id (set null)

    pub approved_at: Option<Timestamp>,
    pub suspended_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
