// listen_progress: Current playback position and completion status per user per episode.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = listen_progress, public)]
pub struct ListenProgress {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub position_ms: i32,
    pub duration_ms: i32,
    pub completed: bool,
    pub updated_at: Timestamp,
}
// Composite unique: (user_id, episode_id) — enforce in reducer logic
// Composite index: (user_id, completed, updated_at) — not supported, enforce in reducer logic
