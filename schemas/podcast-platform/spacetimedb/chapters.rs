// chapters: Timestamped chapter markers within an episode.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = chapters, public)]
pub struct Chapter {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub start_time_ms: i32,
    pub end_time_ms: Option<i32>,
    pub title: String,
    pub url: Option<String>,
    pub image_url: Option<String>,
    pub is_hidden: bool,
    pub position: i32,
    pub created_at: Timestamp,
}
// Composite index: (episode_id, start_time_ms) — not supported, enforce in reducer logic
