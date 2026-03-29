// asset_versions: Immutable version snapshots for an asset.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(asset_id, version_number) — enforce in reducer logic

#[spacetimedb::table(name = asset_versions, public)]
pub struct AssetVersion {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    pub version_number: i32,
    pub storage_key: String,
    pub mime_type: String,
    pub file_size: i64,
    pub file_extension: String,
    pub checksum_sha256: Option<String>,
    pub change_summary: Option<String>,

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
}
