// kb_categories: Hierarchical sections for organizing knowledge base articles.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = kb_categories, public)]
pub struct KbCategory {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → kb_categories.id (set null)
    pub sort_order: i32, // Composite index: (parent_id, sort_order) — enforce in reducer logic
    pub is_published: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
