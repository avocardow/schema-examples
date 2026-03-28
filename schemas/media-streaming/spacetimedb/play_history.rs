// play_history: User listening history with playback context and completion tracking.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PlayContextType {
    Album, // type: String
    Playlist,
    Artist,
    Chart,
    Search,
    Queue,
    Unknown,
}

#[spacetimedb::table(name = play_history, public)]
pub struct PlayHistory {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    pub duration_ms: i32,
    pub completed: bool,
    pub context_type: PlayContextType,
    pub context_id: Option<String>,
    pub played_at: Timestamp,
}
// Composite index: (user_id, played_at) — not supported; btree on user_id covers leading column.
// Composite index: (track_id, played_at) — not supported; btree on track_id covers leading column.
