// service_categories: Hierarchical groupings for organizing bookable services.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = service_categories, public)]
pub struct ServiceCategory {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → service_categories.id (set null)
    pub position: i32,
    #[index(btree)]
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (is_active, position)
}
