// categories: Hierarchical taxonomy for classifying shows by topic.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = categories, public)]
pub struct Category {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → categories.id (cascade delete) — self-referential
    pub created_at: Timestamp,
}
