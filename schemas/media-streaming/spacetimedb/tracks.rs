// tracks: Individual music tracks with metadata and play statistics.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = tracks, public)]
pub struct Track {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub title: String,
    pub duration_ms: i32,
    pub explicit: bool,
    #[index(btree)]
    pub isrc: Option<String>,
    #[index(btree)]
    pub popularity: i32,
    pub preview_url: Option<String>,
    #[index(btree)]
    pub play_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
