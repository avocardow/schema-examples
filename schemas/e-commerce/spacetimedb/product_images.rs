// product_images: Media assets linked to products or specific variants with display ordering.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = product_images, public)]
pub struct ProductImage {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub product_id: String, // FK → products.id (cascade delete); composite index: (product_id, sort_order)

    #[index(btree)]
    pub variant_id: Option<String>, // FK → product_variants.id (set null on delete)

    pub url: String,
    pub alt_text: Option<String>,
    pub sort_order: i32,

    pub created_at: Timestamp,
}
