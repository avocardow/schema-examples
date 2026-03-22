// prices: Currency-specific pricing tiers for product variants with optional date ranges.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = prices, public)]
pub struct Price {
    #[primary_key]
    pub id: String, // UUID auto-generated
    #[index(btree)]
    pub variant_id: String, // FK → product_variants.id (cascade delete)
    pub currency: String,
    pub amount: i32,
    pub compare_at_amount: Option<i32>,
    pub min_quantity: Option<i32>,
    pub starts_at: Option<Timestamp>,
    pub ends_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

// Composite index: (variant_id, currency)
// Composite index: (starts_at, ends_at)
