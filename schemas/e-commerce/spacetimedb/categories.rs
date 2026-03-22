// categories: Product category hierarchy with nested path support.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = categories, public)]
pub struct Category {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub parent_id: Option<String>, // FK → categories.id (cascade delete)
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub path: String,
    pub depth: i32,
    pub sort_order: i32,
    pub is_active: bool, // Composite index: (is_active, sort_order)
    pub image_url: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
