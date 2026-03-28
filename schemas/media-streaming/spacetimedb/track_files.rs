// track_files: Audio file variants for tracks at different quality levels and codecs.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum TrackQuality {
    Low, // type: String
    Normal,
    High,
    Lossless,
}

#[spacetimedb::table(name = track_files, public)]
pub struct TrackFile {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    #[index(btree)]
    pub file_id: String, // UUID — FK → files.id (restrict delete)
    pub quality: TrackQuality,
    pub codec: String,
    pub bitrate_kbps: Option<i32>,
    pub sample_rate_hz: Option<i32>,
    pub file_size_bytes: i32,
    pub created_at: Timestamp,
}
// Composite index: (track_id, quality) — not supported; btree on track_id covers leading column.
