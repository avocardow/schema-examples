// downloads: Offline download records for tracks with expiration and status tracking.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum DownloadStatus {
    Pending, // type: String
    Downloading,
    Completed,
    Expired,
    Failed,
}

#[spacetimedb::table(name = downloads, public)]
pub struct Download {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub track_id: String, // UUID — FK → tracks.id (cascade delete)
    pub track_file_id: String, // UUID — FK → track_files.id (cascade delete)
    pub status: DownloadStatus,
    #[index(btree)]
    pub expires_at: Option<Timestamp>,
    pub downloaded_at: Option<Timestamp>,
    pub created_at: Timestamp,
}
// Composite unique: (user_id, track_file_id) — enforce in reducer logic
// Composite index: (user_id, status) — not supported; btree on user_id covers leading column.
