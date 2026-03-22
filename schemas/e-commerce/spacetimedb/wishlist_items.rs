// wishlist_items: Individual product variants saved to a customer's wishlist.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

// Composite unique: (wishlist_id, variant_id) — enforce in reducer logic

#[spacetimedb::table(name = wishlist_items, public)]
pub struct WishlistItem {
    #[primary_key]
    pub id: String, // UUID auto-generated
    pub wishlist_id: String, // FK → wishlists.id (cascade delete)
    pub variant_id: String, // FK → product_variants.id (cascade delete)
    pub added_at: Timestamp,
}
