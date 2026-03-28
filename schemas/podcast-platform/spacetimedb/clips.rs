// clips: User-created audio clips from episodes with start time and duration.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = clips, public)]
pub struct Clip {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (cascade delete)
    pub title: String,
    pub start_time_ms: i32,
    pub duration_ms: i32,
    pub created_at: Timestamp,
}
