// task_labels: Many-to-many associations between tasks and labels.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = task_labels, public)]
pub struct TaskLabel {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub label_id: String, // UUID — FK → labels.id (cascade delete)
    pub created_at: Timestamp,
    // Composite unique: (task_id, label_id)
}
