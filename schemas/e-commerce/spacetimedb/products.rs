// products: Core product catalog with category/brand relationships and soft delete.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ProductStatus {
    Draft, // type: String
    Active,
    Archived,
}

// Composite index: (status, deleted_at) — enforce in reducer logic or query layer

#[spacetimedb::table(name = products, public)]
pub struct Product {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub category_id: Option<String>, // FK → categories.id (set null on delete)

    #[index(btree)]
    pub brand_id: Option<String>, // FK → brands.id (set null on delete)

    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,

    #[index(btree)]
    pub status: ProductStatus, // default: Draft

    pub product_type: Option<String>,
    pub options: Option<String>,  // JSON
    pub metadata: Option<String>, // JSON, default: {}

    #[index(btree)]
    pub is_featured: bool, // default: false

    #[index(btree)]
    pub deleted_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
