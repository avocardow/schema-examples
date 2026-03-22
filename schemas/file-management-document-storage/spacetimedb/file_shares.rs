// file_shares: Direct access grants to specific users, groups, or organizations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Discriminator for whether a file or folder is being shared.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileShareTargetType {
    File,
    Folder,
}

/// Who the share is granted to.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileShareSharedWithType {
    User,
    Group,
    Organization,
}

/// Permission level granted by this share.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileShareRole {
    Viewer,
    Commenter,
    Editor,
    CoOwner,
}

#[spacetimedb::table(name = file_shares, public)]
pub struct FileShare {
    #[primary_key]
    pub id: String, // UUID

    // What is being shared. Exactly one of target_file_id or target_folder_id must be set.
    #[index(btree)]
    pub target_type: FileShareTargetType,

    #[index(btree)]
    pub target_file_id: Option<String>, // UUID — FK → files.id (cascade delete)

    #[index(btree)]
    pub target_folder_id: Option<String>, // UUID — FK → folders.id (cascade delete)

    #[index(btree)]
    pub shared_by: String, // FK → users.id (restrict delete)

    // Who the share is granted to. Target depends on shared_with_type.
    #[index(btree)]
    pub shared_with_type: FileShareSharedWithType,

    #[index(btree)]
    pub shared_with_id: String, // Polymorphic — not a FK.

    pub role: FileShareRole,
    pub allow_reshare: bool,

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // None = never expires.
    pub accepted_at: Option<Timestamp>, // None = pending acceptance.
    pub message: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
