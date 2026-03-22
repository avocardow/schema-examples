// file_versions: Immutable version history for files — each row is a point-in-time snapshot with its own storage key.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = file_versions, public)]
pub struct FileVersion {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub file_id: String, // UUID — FK → files.id (cascade delete)

    pub version_number: i32, // Monotonic counter per file: 1, 2, 3, ...

    #[unique]
    pub storage_key: String, // Path to this version's bytes.

    pub size: i64, // This version's file size in bytes.
    pub checksum_sha256: Option<String>, // This version's content hash.
    pub mime_type: String, // This version's MIME type. May differ between versions.
    pub change_summary: Option<String>, // Human-readable description of what changed.

    // Denormalized flag: true for the active version.
    // Kept in sync with files.current_version_id.
    pub is_current: bool,

    pub created_by: String, // UUID — FK → users.id (restrict delete)
    pub created_at: Timestamp,
    // No updated_at — versions are immutable (append-only).
}
