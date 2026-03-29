// renditions: Pre-generated derivative formats of an asset (thumbnails, previews, etc.).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(asset_id, preset_name) — enforce in reducer logic

#[spacetimedb::table(name = renditions, public)]
pub struct Rendition {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    pub preset_name: String,
    pub storage_key: String,
    pub mime_type: String,
    pub file_size: i64,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub format: String,

    pub created_at: Timestamp,
}
