// pipelines: Sales pipelines representing different deal workflows.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = pipelines, public)]
pub struct Pipeline {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    pub description: Option<String>,
    pub is_default: bool,
    #[index(btree)]
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
