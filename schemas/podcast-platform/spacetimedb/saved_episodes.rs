// saved_episodes: Episodes bookmarked by users for later listening.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = saved_episodes, public)]
pub struct SavedEpisode {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub created_at: Timestamp,
}
// Composite unique: (user_id, episode_id) — enforce in reducer logic
// Composite index: (user_id, created_at) — not supported, enforce in reducer logic
