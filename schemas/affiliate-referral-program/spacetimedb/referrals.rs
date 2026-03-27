// referrals: Tracks each referral from click through conversion or expiry.
// Composite index: (affiliate_id, status) — not supported; indexed separately

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ReferralStatus {
    Visit,
    Lead,
    Converted,
    Expired,
}

#[spacetimedb::table(name = referrals, public)]
pub struct Referral {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub affiliate_id: String, // UUID, FK -> affiliates.id (cascade delete)

    pub click_id: Option<String>, // UUID, FK -> clicks.id (set null)

    #[index(btree)]
    pub visitor_id: Option<String>,

    #[index(btree)]
    pub email: Option<String>,

    #[index(btree)]
    pub status: ReferralStatus, // default: Visit

    pub landing_url: Option<String>,

    pub metadata: Option<String>, // JSON stored as string

    pub converted_at: Option<Timestamp>,
    pub expires_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
