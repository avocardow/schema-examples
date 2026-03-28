// transcripts: Episode transcript content in various formats and languages.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TranscriptFormat {
    Srt, // type: String
    Vtt,
    Json,
    Text,
}

#[spacetimedb::table(name = transcripts, public)]
pub struct Transcript {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub format: TranscriptFormat,
    pub content_url: Option<String>,
    pub content: Option<String>,
    pub language: String,
    pub is_auto_generated: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite index: (episode_id, format, language) — not supported, enforce in reducer logic
