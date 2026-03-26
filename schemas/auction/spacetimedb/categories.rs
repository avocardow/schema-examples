// categories: Auction listing categories with hierarchical parent-child structure.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = categories, public)]
pub struct Category {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub parent_id: Option<String>, // UUID, FK -> categories.id (set null delete)

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,

    #[index(btree)]
    pub sort_order: i32,

    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
