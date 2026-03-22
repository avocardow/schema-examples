// product_collections: Curated groupings of products for merchandising and storefront display.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = product_collections, public)]
pub struct ProductCollection {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,
    pub image_url: Option<String>,

    pub sort_order: i32,
    pub is_active: bool, // Composite index: (is_active, sort_order)

    pub metadata: Option<String>, // JSON

    pub published_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
