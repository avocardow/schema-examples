// wishlists: User-curated lists of saved products for future purchase.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = wishlists, public)]
pub struct Wishlist {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)
    pub name: String,
    pub is_public: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
