// task_lists: Groupings of tasks within a project for organizational purposes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = task_lists, public)]
pub struct TaskList {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    pub name: String,
    pub description: Option<String>,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (project_id, position)
}
