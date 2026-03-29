// assets: Core asset entity — metadata about managed digital files.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum AssetType {
    Image,    // type: String
    Video,
    Audio,
    Document,
    Font,
    Archive,
    Other,
}

#[derive(SpacetimeType, Clone)]
pub enum AssetStatus {
    Draft,    // type: String
    Active,
    Archived,
    Expired,
}

// Composite index: (workspace_id, folder_id) — enforce in query/reducer logic
// Composite index: (workspace_id, asset_type) — enforce in query/reducer logic
// Composite index: (workspace_id, status) — enforce in query/reducer logic

#[spacetimedb::table(name = assets, public)]
pub struct Asset {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    pub folder_id: Option<String>, // FK → folders.id (set null on delete)

    pub name: String,
    pub original_filename: String,
    pub description: Option<String>,

    #[unique]
    pub storage_key: String,

    #[index(btree)]
    pub mime_type: String,

    pub file_size: i64,
    pub file_extension: String,

    pub asset_type: AssetType,
    pub status: AssetStatus,

    // Circular reference: asset_versions.asset_id → assets.id.
    pub current_version_id: Option<String>, // UUID — FK → asset_versions.id (set null on delete)

    pub version_count: i32, // default 1

    pub width: Option<i32>,
    pub height: Option<i32>,
    pub duration_seconds: Option<f64>,
    pub color_space: Option<String>,
    pub dpi: Option<i32>,

    #[index(btree)]
    pub uploaded_by: String, // FK → users.id (restrict delete)

    pub checksum_sha256: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
