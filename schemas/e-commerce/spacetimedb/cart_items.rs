// cart_items: Individual line items within a shopping cart, linking a cart to a specific product variant with quantity.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = cart_items, public)]
pub struct CartItem {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub cart_id: String, // FK → carts.id (cascade delete); composite unique: (cart_id, variant_id)

    #[index(btree)]
    pub variant_id: String, // FK → product_variants.id (cascade delete)

    pub quantity: i32, // default 1

    pub added_at: Timestamp,
    pub updated_at: Timestamp,
}
