// vendor_reviews: Customer ratings and reviews for vendor performance.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum VendorReviewStatus {
    Pending,
    Approved,
    Rejected,
}

// Composite unique: (vendor_id, customer_id, vendor_order_id)
// Composite index: (vendor_id, status)

#[spacetimedb::table(name = vendor_reviews, public)]
pub struct VendorReview {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (cascade delete)

    pub customer_id: String, // UUID, FK -> users.id (cascade delete)
    pub vendor_order_id: Option<String>, // UUID, FK -> vendor_orders.id (set null)
    pub rating: i32,
    pub title: Option<String>,
    pub body: Option<String>,
    #[index(btree)]
    pub status: VendorReviewStatus,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
