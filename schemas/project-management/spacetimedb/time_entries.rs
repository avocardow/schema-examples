// time_entries: Logged time spent by users working on tasks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = time_entries, public)]
pub struct TimeEntry {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub description: Option<String>,
    pub start_time: Option<Timestamp>,
    pub end_time: Option<Timestamp>,
    pub duration: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (user_id, start_time)
}
