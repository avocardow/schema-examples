// folders: Folder tree with materialized path for efficient subtree queries.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = folders, public)]
pub struct Folder {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub bucket_id: String, // FK → storage_buckets.id (cascade delete)

    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → folders.id (cascade delete). None = root-level folder.

    pub name: String, // Display name (e.g., "Documents", "Photos 2024").

    // Materialized path using folder IDs as segments.
    // Format: /{parent_uuid}/{this_uuid}/ (e.g., "/abc123/def456/").
    // Uses UUIDs (not names) so folder renames don't cascade path updates.
    pub path: String,

    #[index(btree)]
    pub depth: i32, // Hierarchy level. 0 = root, 1 = child of root, etc.
    pub description: Option<String>,

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
