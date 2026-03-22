// folder_permissions: Per-user permission grants on folders, supporting inherited and directly assigned access.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Level of access a user holds on a folder.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FolderPermissionLevel {
    View,
    Edit,
    Manage,
}

#[spacetimedb::table(name = folder_permissions, public)]
pub struct FolderPermission {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    // Composite unique constraint: (folder_id, user_id)
    #[index(btree)]
    pub folder_id: String, // UUID — FK → folders.id (cascade delete)

    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)

    pub permission: FolderPermissionLevel, // default: View
    pub inherited: bool,                   // default: false

    pub granted_by: Option<String>, // UUID — FK → users.id (set null on delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
