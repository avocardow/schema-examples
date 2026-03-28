// lyrics: Song lyrics with optional synchronized timing data for tracks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = lyrics, public)]
pub struct Lyric {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    pub plain_text: Option<String>,
    pub synced_text: Option<String>, // JSON stored as string
    #[index(btree)]
    pub language: Option<String>,
    pub source: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
