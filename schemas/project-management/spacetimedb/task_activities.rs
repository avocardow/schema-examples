// task_activities: Audit log of actions performed on tasks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TaskActivityAction {
    Created, // type: String
    Updated,
    Commented,
    Assigned,
    Unassigned,
    Labeled,
    Unlabeled,
    Moved,
    Archived,
    Restored,
}

#[spacetimedb::table(name = task_activities, public)]
pub struct TaskActivity {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)
    pub action: TaskActivityAction,
    pub field: Option<String>,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
    pub created_at: Timestamp,
    // Composite index: (task_id, created_at)
}
