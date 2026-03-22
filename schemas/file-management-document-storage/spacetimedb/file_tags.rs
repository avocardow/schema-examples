// file_tags: Tag definitions for organizing files with visibility levels (public, private, system).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// public = visible to all users.
/// private = visible only to the creator.
/// system = admin-managed, visible to all but only admins can assign.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileTagVisibility {
    Public,
    Private,
    System,
}

#[spacetimedb::table(name = file_tags, public)]
pub struct FileTag {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String, // Tag name (e.g., "important", "reviewed", "needs-update").

    pub color: Option<String>, // Hex color for UI display (e.g., "#ff5733").

    #[index(btree)]
    pub visibility: FileTagVisibility,

    pub description: Option<String>,

    pub created_by: String, // FK → users.id (restrict delete)
    pub created_at: Timestamp,
}
