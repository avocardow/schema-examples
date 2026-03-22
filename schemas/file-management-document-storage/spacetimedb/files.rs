// files: Core file entity — metadata about stored bytes (the "blob" in the blob + attachment split).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = files, public)]
pub struct File {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub bucket_id: String, // FK → storage_buckets.id (cascade delete)

    #[index(btree)]
    pub folder_id: Option<String>, // FK → folders.id (set null on delete). Null = bucket root.

    // Identity and display
    pub name: String, // Current display filename (e.g., "Q4 Report.pdf").
    pub original_filename: String, // Filename at upload time. Never changes after upload.

    #[unique]
    pub storage_key: String, // Path to bytes in the storage backend. Immutable after upload.

    // File properties
    #[index(btree)]
    pub mime_type: String, // MIME type (e.g., "application/pdf", "image/png").

    pub size: i64, // File size in bytes. i64 supports files >2GB.

    #[index(btree)]
    pub checksum_sha256: Option<String>, // SHA-256 hash for duplicate detection and integrity verification.
    pub etag: Option<String>,            // HTTP ETag for cache validation.

    // Versioning: pointer to the current active version.
    // Null until the first version is explicitly created (versioning may be off for the bucket).
    // Circular reference: file_versions.file_id → files.id.
    pub current_version_id: Option<String>, // UUID — FK → file_versions.id (set null on delete)

    // Metadata (stored as JSON strings — parse in application code).
    pub metadata: Option<String>,      // System-extracted metadata (dimensions, duration, pages, EXIF).
    pub user_metadata: Option<String>, // User-defined key-value pairs.

    // Ownership
    #[index(btree)]
    pub uploaded_by: String, // FK → users.id (restrict delete)

    pub is_public: bool,

    // Soft delete
    #[index(btree)]
    pub deleted_at: Option<Timestamp>, // When the file was trashed. None = not deleted.

    pub deleted_by: Option<String>,       // FK → users.id (set null on delete)
    pub original_folder_id: Option<String>, // FK → folders.id (set null on delete). Restore to original location.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
