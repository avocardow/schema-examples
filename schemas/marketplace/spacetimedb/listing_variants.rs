// listing_variants: Pricing and stock for specific product variants within a listing.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (listing_id, variant_id)

#[spacetimedb::table(name = listing_variants, public)]
pub struct ListingVariant {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub listing_id: String, // UUID, FK -> listings.id (cascade delete)

    #[index(btree)]
    pub variant_id: String, // UUID, FK -> product_variants.id (cascade delete)

    pub price: i32,
    pub currency: String,
    pub sale_price: Option<i32>,
    pub stock_quantity: i32,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
