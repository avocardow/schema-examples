// listen_history: Detailed log of listening sessions with source device tracking.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ListenSource {
    App, // type: String
    Web,
    Car,
    SmartSpeaker,
    Watch,
    Unknown,
}

#[spacetimedb::table(name = listen_history, public)]
pub struct ListenHistory {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub started_at: Timestamp,
    pub ended_at: Option<Timestamp>,
    pub position_start_ms: i32,
    pub position_end_ms: Option<i32>,
    pub duration_listened_ms: i32,
    pub source: ListenSource,
    pub created_at: Timestamp,
}
// Composite index: (user_id, started_at) — not supported, enforce in reducer logic
// Composite index: (episode_id, started_at) — not supported, enforce in reducer logic
