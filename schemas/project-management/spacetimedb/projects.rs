// projects: Top-level project containers for organizing tasks and work.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ProjectVisibility {
    Public, // type: String
    Private,
}

#[spacetimedb::table(name = projects, public)]
pub struct Project {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub key: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub color: Option<String>,
    pub visibility: ProjectVisibility,
    pub task_count: i32,
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
