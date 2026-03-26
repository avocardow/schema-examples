// item_images: Photographs and visual media attached to auction items.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = item_images, public)]
pub struct ItemImage {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub item_id: String, // UUID — FK → items.id (cascade delete)

    pub url: String,
    pub alt_text: Option<String>,
    pub sort_order: i32, // Default 0

    pub created_at: Timestamp,
    // No updated_at — image metadata is replaced, not mutated.
}
