// file_activities: Audit trail for file and folder operations. Append-only — rows are never updated or deleted.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileActivityAction {
    Created,
    Uploaded,
    Updated,
    Renamed,
    Moved,
    Copied,
    Deleted,
    Restored,
    Shared,
    Unshared,
    Downloaded,
    Locked,
    Unlocked,
    Commented,
    VersionCreated,
}

// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileActivityTargetType {
    File,
    Folder,
}

#[spacetimedb::table(name = file_activities, public)]
pub struct FileActivity {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub actor_id: String, // FK → users.id (restrict delete)

    pub action: FileActivityAction,

    #[index(btree)]
    pub target_type: FileActivityTargetType, // Whether the action was on a file or folder.

    #[index(btree)]
    pub target_id: String, // The file or folder ID. Not a FK — target may be permanently deleted.

    pub target_name: String, // Denormalized: file/folder name at the time of the action.

    pub details: Option<String>, // JSON. Action-specific context (e.g., moved: {from_folder_id, to_folder_id}).
    pub ip_address: Option<String>, // Client IP address for security audit.

    #[index(btree)]
    pub created_at: Timestamp, // Immutable. Activities are append-only — no updated_at.
}
