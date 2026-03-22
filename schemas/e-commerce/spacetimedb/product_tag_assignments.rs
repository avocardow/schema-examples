// product_tag_assignments: Many-to-many join linking products to tags for flexible categorization.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = product_tag_assignments, public)]
pub struct ProductTagAssignment {
    #[primary_key]
    pub id: String, // UUID auto-generated

    pub product_id: String, // FK → products.id (cascade delete); composite unique: (product_id, tag_id)

    #[index(btree)]
    pub tag_id: String, // FK → product_tags.id (cascade delete)

    pub created_at: Timestamp,
}
