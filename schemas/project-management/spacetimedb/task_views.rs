// task_views: Saved view configurations for browsing tasks in a project.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TaskViewLayout {
    List, // type: String
    Board,
    Calendar,
    Timeline,
}

#[spacetimedb::table(name = task_views, public)]
pub struct TaskView {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (cascade delete)
    pub name: String,
    pub description: Option<String>,
    pub layout: TaskViewLayout,
    pub filters: Option<String>, // JSON
    pub sort_by: Option<String>, // JSON
    pub group_by: Option<String>,
    pub is_shared: bool,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (project_id, position)
}
