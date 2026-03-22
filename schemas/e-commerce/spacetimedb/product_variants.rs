// product_variants: SKU-level variants of a product with dimensions and sorting.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = product_variants, public)]
pub struct ProductVariant {
    #[primary_key]
    pub id: String, // UUID auto-generated
    #[index(btree)]
    pub product_id: String, // FK → products.id (cascade delete)
    #[index(btree)]
    pub shipping_profile_id: Option<String>, // FK → shipping_profiles.id (set null on delete)
    // Unique: sku — nullable, enforce in reducer logic
    pub sku: Option<String>,
    #[index(btree)]
    pub barcode: Option<String>,
    pub title: String,
    pub option_values: Option<String>, // JSON
    pub weight_grams: Option<i32>,
    pub height_mm: Option<i32>,
    pub width_mm: Option<i32>,
    pub length_mm: Option<i32>,
    pub is_active: bool,
    pub sort_order: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
