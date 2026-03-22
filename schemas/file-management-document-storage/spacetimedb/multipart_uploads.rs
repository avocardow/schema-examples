// multipart_uploads: Resumable upload session tracking — lifecycle management from initiation to completion or expiry.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// type: String
#[derive(SpacetimeType, Clone)]
pub enum MultipartUploadStatus {
    InProgress,
    Completing,
    Completed,
    Aborted,
    Expired,
}

// type: String
#[derive(SpacetimeType, Clone)]
pub enum MultipartUploadType {
    Single,
    Multipart,
    Resumable,
}

#[spacetimedb::table(name = multipart_uploads, public)]
pub struct MultipartUpload {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub bucket_id: String, // UUID — FK → storage_buckets.id (cascade delete)

    pub storage_key: String, // Intended storage path for the completed file.
    pub filename: String, // Intended filename for the completed file.
    pub mime_type: Option<String>, // Expected MIME type. Nullable: may not be known at initiation.
    pub total_size: Option<i64>, // Expected total size in bytes. Nullable: tus supports Upload-Defer-Length.
    pub uploaded_size: i64, // Default 0. Bytes received so far.
    pub part_count: i32, // Default 0. Number of parts received so far.

    #[index(btree)]
    pub status: MultipartUploadStatus, // Default in_progress.

    pub upload_type: MultipartUploadType, // Default single.
    pub metadata: Option<String>, // JSON — Upload metadata key-value pairs from the client.

    #[index(btree)]
    pub initiated_by: String, // UUID — FK → users.id (restrict delete)

    pub expires_at: Timestamp, // Server-set expiry for cleanup. Always set.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
