// recordings: captured audio/video recordings of meeting sessions.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum RecordingType {
    Composite, // type: String
    AudioOnly,
    VideoOnly,
    ScreenShare,
}

#[derive(SpacetimeType, Clone)]
pub enum RecordingStatus {
    Recording, // type: String
    Processing,
    Ready,
    Failed,
    Deleted,
}

#[spacetimedb::table(name = recordings, public)]
pub struct Recording {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    pub file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub recording_type: RecordingType,
    #[index(btree)]
    pub recording_status: RecordingStatus,
    pub duration_seconds: Option<i32>,
    pub file_size: Option<i64>,
    pub started_at: Timestamp,
    pub ended_at: Option<Timestamp>,
    #[index(btree)]
    pub started_by: Option<String>, // UUID — FK → users.id (set null on delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
