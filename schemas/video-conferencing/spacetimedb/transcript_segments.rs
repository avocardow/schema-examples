// transcript_segments: individual timed text segments within a transcript.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index (transcript_id, position) — not supported in SpacetimeDB
// Composite index (transcript_id, start_ms) — not supported in SpacetimeDB

#[spacetimedb::table(name = transcript_segments, public)]
pub struct TranscriptSegment {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub transcript_id: String, // UUID — FK → transcripts.id (cascade delete)
    #[index(btree)]
    pub speaker_id: Option<String>, // UUID — FK → users.id (set null on delete)
    pub content: String,
    pub speaker_name: Option<String>,
    pub start_ms: i32,
    pub end_ms: i32,
    pub position: i32,
    pub confidence: Option<f64>,
    pub created_at: Timestamp,
}
