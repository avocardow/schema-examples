// labels: Categorization tags that can be applied to tasks within a project.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = labels, public)]
pub struct Label {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    pub name: String,
    pub color: Option<String>,
    pub description: Option<String>,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite unique: (project_id, name)
}
