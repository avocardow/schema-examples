// episode_queue: Ordered queue of episodes a user intends to listen to next.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = episode_queue, public)]
pub struct EpisodeQueue {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub position: i32,
    pub added_at: Timestamp,
}
// Composite unique: (user_id, episode_id) — enforce in reducer logic
// Composite index: (user_id, position) — not supported, enforce in reducer logic
