// file_shortcuts: Cross-folder references without file duplication — similar to Google Drive shortcuts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Discriminator for which target FK is populated.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileShortcutTargetType {
    File,
    Folder,
}

#[spacetimedb::table(name = file_shortcuts, public)]
pub struct FileShortcut {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub folder_id: String, // FK → folders.id (cascade delete)

    pub target_type: FileShortcutTargetType,

    #[index(btree)]
    pub target_file_id: Option<String>, // UUID — FK → files.id (cascade delete)

    #[index(btree)]
    pub target_folder_id: Option<String>, // UUID — FK → folders.id (cascade delete)

    pub name: Option<String>, // Override display name. None = use the target's name.

    pub created_by: String, // FK → users.id (restrict delete)
    pub created_at: Timestamp,
}
