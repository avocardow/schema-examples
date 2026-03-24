// task_assignees: User assignments to tasks with specific roles.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TaskAssigneeRole {
    Assignee, // type: String
    Reviewer,
}

#[spacetimedb::table(name = task_assignees, public)]
pub struct TaskAssignee {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub role: TaskAssigneeRole,
    pub created_at: Timestamp,
    // Composite unique: (task_id, user_id)
}
