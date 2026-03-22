// multipart_upload_parts: Individual parts of a multipart upload, assembled into the final file on completion.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = multipart_upload_parts, public)]
pub struct MultipartUploadPart {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub upload_id: String, // FK → multipart_uploads.id (cascade delete)

    // 1-based ordering. Parts are assembled in part_number order.
    pub part_number: i32,

    // This part's size in bytes.
    pub size: i64,

    // Per-part integrity hash (e.g., MD5, CRC32). S3 returns this as the part's ETag.
    pub checksum: Option<String>,

    // Temporary storage location for this part. Cleaned up after assembly into the final file.
    pub storage_key: String,

    pub created_at: Timestamp,
}

// Unique constraint on (upload_id, part_number) enforced at the application layer.
// SpacetimeDB supports unique on single columns; composite uniqueness requires app-level enforcement.
