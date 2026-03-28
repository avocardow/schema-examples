// episode_downloads: Offline download state and metadata per user per episode per device.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum EpisodeDownloadStatus {
    Queued, // type: String
    Downloading,
    Completed,
    Failed,
    Expired,
}

#[spacetimedb::table(name = episode_downloads, public)]
pub struct EpisodeDownload {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub episode_id: String, // UUID — FK → episodes.id (cascade delete)
    pub status: EpisodeDownloadStatus,
    pub device_id: Option<String>,
    pub file_size_bytes: Option<i32>,
    pub downloaded_at: Option<Timestamp>,
    #[index(btree)]
    pub expires_at: Option<Timestamp>,
    pub created_at: Timestamp,
}
// Composite unique: (user_id, episode_id, device_id) — enforce in reducer logic
// Composite index: (user_id, status) — not supported, enforce in reducer logic
