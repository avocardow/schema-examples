// tasks: Individual work items tracked within a project.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TaskType {
    Task, // type: String
    Bug,
    Story,
    Epic,
}

#[derive(SpacetimeType, Clone)]
pub enum TaskPriority {
    None, // type: String
    Urgent,
    High,
    Medium,
    Low,
}

#[spacetimedb::table(name = tasks, public)]
pub struct Task {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    pub task_list_id: Option<String>, // UUID — FK → task_lists.id (set null)
    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → tasks.id (cascade delete)
    pub status_id: Option<String>, // UUID — FK → project_statuses.id (set null)
    #[index(btree)]
    pub milestone_id: Option<String>, // UUID — FK → milestones.id (set null)
    pub number: i32,
    pub title: String,
    pub description: Option<String>,
    #[index(btree)]
    pub r#type: TaskType,
    pub priority: TaskPriority,
    #[index(btree)]
    pub due_date: Option<String>,
    pub start_date: Option<String>,
    pub estimate_points: Option<i32>,
    pub position: i32,
    pub completed_at: Option<Timestamp>,
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite unique: (project_id, number)
    // Composite index: (project_id, status_id)
    // Composite index: (task_list_id, position)
}
