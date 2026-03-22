// file_share_links: URL-based sharing with optional password protection, expiry, and download tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Discriminator for which target FK is populated.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileShareLinkTargetType {
    File,
    Folder,
}

/// Who can access the link.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileShareLinkScope {
    Anyone,
    Organization,
    SpecificUsers,
}

/// What the recipient can do.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileShareLinkPermission {
    View,
    Download,
    Edit,
    Upload,
}

#[spacetimedb::table(name = file_share_links, public)]
pub struct FileShareLink {
    #[primary_key]
    pub id: String, // UUID

    pub target_type: FileShareLinkTargetType,

    #[index(btree)]
    pub target_file_id: Option<String>, // UUID — FK → files.id (cascade delete)

    #[index(btree)]
    pub target_folder_id: Option<String>, // UUID — FK → folders.id (cascade delete)

    #[index(btree)]
    pub created_by: String, // FK → users.id (restrict delete)

    #[unique]
    pub token: String, // URL-safe token for the share link.

    pub scope: FileShareLinkScope,
    pub permission: FileShareLinkPermission,
    pub password_hash: Option<String>, // Hashed — never store plaintext.

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // None = never expires.

    pub max_downloads: Option<i32>, // None = unlimited.
    pub download_count: i32,        // Increment atomically on each download.
    pub name: Option<String>,       // Human-readable name (e.g., "Client review link").
    pub is_active: bool,            // Disable a link without deleting it.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
