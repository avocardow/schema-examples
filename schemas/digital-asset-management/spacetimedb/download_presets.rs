// download_presets: Predefined output configurations for asset downloads.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = download_presets, public)]
pub struct DownloadPreset {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    pub name: String,
    pub output_format: Option<String>,
    pub max_width: Option<i32>,
    pub max_height: Option<i32>,
    pub quality: Option<i32>,
    pub dpi: Option<i32>,

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
