// task_comments: Threaded discussion comments on tasks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = task_comments, public)]
pub struct TaskComment {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)
    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → task_comments.id (cascade delete)
    pub content: String,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
