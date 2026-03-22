// product_collection_items: Junction linking products to curated collections with ordering.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

// Composite unique: (collection_id, product_id) — enforce in reducer logic

#[spacetimedb::table(name = product_collection_items, public)]
pub struct ProductCollectionItem {
    #[primary_key]
    pub id: String, // UUID auto-generated
    pub collection_id: String, // FK → product_collections.id (cascade delete)
    #[index(btree)]
    pub product_id: String, // FK → products.id (cascade delete)
    pub sort_order: i32,
    pub added_at: Timestamp,
}
