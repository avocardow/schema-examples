// categories: Hierarchical content categories with nested path support.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = categories, public)]
pub struct Category {
    #[primary_key]
    pub id: String, // UUID
    pub parent_id: Option<String>, // FK -> categories.id (cascade delete)
    pub name: String,
    pub slug: String, // Unique
    pub description: Option<String>,
    #[index(btree)]
    pub path: String,
    pub depth: i32,
    pub sort_order: i32, // Composite index: (parent_id, sort_order), (is_active, sort_order)
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
