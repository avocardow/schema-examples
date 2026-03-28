// episodes: Individual episode content with metadata, enclosures, and playback info.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum EpisodeType {
    Full, // type: String
    Trailer,
    Bonus,
}

#[spacetimedb::table(name = episodes, public)]
pub struct Episode {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    pub title: String,
    pub slug: String,
    pub description: Option<String>,
    pub html_description: Option<String>,
    pub episode_type: EpisodeType,
    pub season_number: Option<i32>,
    pub episode_number: Option<i32>,
    pub duration_ms: i32,
    pub explicit: bool,
    pub audio_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub artwork_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub enclosure_url: Option<String>,
    pub enclosure_length: Option<i32>,
    pub enclosure_type: Option<String>,
    #[index(btree)]
    pub guid: Option<String>,
    #[index(btree)]
    pub published_at: Option<Timestamp>,
    pub is_blocked: bool,
    pub play_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite unique: (show_id, slug) — enforce in reducer logic
// Composite index: (show_id, published_at) — not supported, enforce in reducer logic
// Composite index: (show_id, season_number, episode_number) — not supported, enforce in reducer logic
