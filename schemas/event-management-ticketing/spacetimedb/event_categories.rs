// event_categories: Hierarchical classification of events.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = event_categories, public)]
pub struct EventCategory {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,

    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → event_categories.id (set null)

    pub position: i32,
    pub color: Option<String>,
    pub icon: Option<String>,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (is_active, position)
}
