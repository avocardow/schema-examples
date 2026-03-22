// product_reviews: User-submitted ratings and written feedback for purchased products.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ReviewStatus {
    Pending, // type: String
    Approved,
    Rejected,
}

#[spacetimedb::table(name = product_reviews, public)]
pub struct ProductReview {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    pub product_id: String, // FK → products.id (cascade delete)

    pub user_id: String, // FK → users.id (cascade delete)

    pub rating: i32, // not null

    pub title: Option<String>,
    pub body: Option<String>,

    #[index(btree)]
    pub status: ReviewStatus, // not null, default: Pending

    pub verified_purchase: bool, // not null, default: false

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

// Composite unique: (product_id, user_id)
// Composite index: (product_id, status)
