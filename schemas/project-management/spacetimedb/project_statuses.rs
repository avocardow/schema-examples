// project_statuses: Workflow status definitions for tasks within a project.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ProjectStatusCategory {
    Backlog, // type: String
    Unstarted,
    Started,
    Completed,
    Cancelled,
}

#[spacetimedb::table(name = project_statuses, public)]
pub struct ProjectStatus {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    pub name: String,
    pub color: Option<String>,
    pub category: ProjectStatusCategory,
    pub position: i32,
    pub is_default: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (project_id, position)
    // Composite index: (project_id, category)
}
