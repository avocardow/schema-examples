// storage_buckets: Logical containers for files with per-bucket configuration and upload constraints.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = storage_buckets, public)]
pub struct StorageBucket {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String, // Human-readable bucket name. Used in API paths (e.g., /storage/avatars/).

    pub description: Option<String>,

    // Controls anonymous read access to files in this bucket.
    // false = all access requires authentication.
    // true = files are publicly readable (e.g., CDN-served assets).
    pub is_public: bool,

    pub allowed_mime_types: Vec<String>, // Whitelist of accepted MIME types. Empty = all types allowed.
    pub max_file_size: Option<i64>,      // Maximum file size in bytes. None = no limit.

    // Whether files in this bucket track version history.
    pub versioning_enabled: bool,

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
