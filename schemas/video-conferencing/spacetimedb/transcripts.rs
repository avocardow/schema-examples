// transcripts: generated text transcriptions of meeting audio.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum TranscriptStatus {
    Processing, // type: String
    Ready,
    Failed,
}

#[spacetimedb::table(name = transcripts, public)]
pub struct Transcript {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    pub language: String,
    #[index(btree)]
    pub transcript_status: TranscriptStatus,
    pub started_by: Option<String>, // UUID — FK → users.id (set null on delete)
    pub segment_count: i32,
    pub started_at: Timestamp,
    pub completed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
