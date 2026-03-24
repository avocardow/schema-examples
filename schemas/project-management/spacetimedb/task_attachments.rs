// task_attachments: Files attached to tasks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = task_attachments, public)]
pub struct TaskAttachment {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub uploaded_by: Option<String>, // UUID — FK → users.id (set null)
    pub file_name: String,
    pub file_url: String,
    pub file_size: Option<i32>,
    pub mime_type: Option<String>,
    pub created_at: Timestamp,
}
