// listings: Vendor product listings with approval workflow and condition tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ListingStatus {
    Draft,
    PendingApproval,
    Active,
    Paused,
    Rejected,
    Archived,
}

#[derive(SpacetimeType, Clone)]
pub enum ListingCondition {
    New,
    Refurbished,
    UsedLikeNew,
    UsedGood,
    UsedFair,
}

// Composite unique: (vendor_id, product_id)

#[spacetimedb::table(name = listings, public)]
pub struct Listing {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (cascade delete)

    #[index(btree)]
    pub product_id: String, // UUID, FK -> products.id (cascade delete)

    #[index(btree)]
    pub status: ListingStatus,
    pub condition: ListingCondition,
    pub handling_days: i32,
    pub rejection_reason: Option<String>,
    pub approved_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
