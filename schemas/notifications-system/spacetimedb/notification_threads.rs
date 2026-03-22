// notification_threads: Thread-level state for grouping related notifications. Per-thread read tracking, metadata, and efficient "threads with unread" queries.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = notification_threads, public)]
pub struct NotificationThread {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub thread_key: String, // e.g., "issue:456", "pr:789". Must match the thread_key on events.

    pub title: Option<String>,    // e.g., "Fix login bug (#456)". Can be updated as the thread evolves.
    pub icon: Option<String>,     // Icon URL or icon identifier for the thread.

    #[index(btree)]
    pub category_id: Option<String>, // UUID — FK → notification_categories.id (set null on delete)

    pub notification_count: i32, // Counter cache. Default 0 in app logic.

    #[index(btree)]
    pub last_activity_at: Option<Timestamp>, // When the most recent event in this thread occurred.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
