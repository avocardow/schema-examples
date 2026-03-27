// quality_logs: network and media quality metrics sampled during meetings.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index (meeting_id, logged_at) — not supported in SpacetimeDB
// Composite index (participant_id, logged_at) — not supported in SpacetimeDB

#[spacetimedb::table(name = quality_logs, public)]
pub struct QualityLog {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    #[index(btree)]
    pub participant_id: String, // UUID — FK → meeting_participants.id (cascade delete)
    pub bitrate_kbps: Option<i32>,
    pub packet_loss_pct: Option<f64>,
    pub jitter_ms: Option<i32>,
    pub round_trip_ms: Option<i32>,
    pub video_width: Option<i32>,
    pub video_height: Option<i32>,
    pub framerate: Option<i32>,
    pub quality_score: Option<f64>,
    pub logged_at: Timestamp,
    pub created_at: Timestamp,
}
