// vendors: Marketplace vendor accounts with status and verification tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum VendorStatus {
    Pending,
    Active,
    Suspended,
    Deactivated,
}

#[derive(SpacetimeType, Clone)]
pub enum VerificationStatus {
    Unverified,
    PendingReview,
    Verified,
    Rejected,
}

#[spacetimedb::table(name = vendors, public)]
pub struct Vendor {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub owner_id: String, // UUID, FK -> users.id (restrict delete)

    pub name: String,

    #[unique]
    pub slug: String,

    pub email: String,
    pub phone: Option<String>,

    #[index(btree)]
    pub status: VendorStatus,

    #[index(btree)]
    pub verification_status: VerificationStatus,

    pub commission_rate: Option<f64>,
    pub metadata: Option<String>, // JSON
    pub approved_at: Option<Timestamp>,
    pub suspended_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
