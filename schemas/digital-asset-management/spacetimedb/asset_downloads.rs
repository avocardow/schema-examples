// asset_downloads: Immutable log of asset download events.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = asset_downloads, public)]
pub struct AssetDownload {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    // Index: downloaded_by — enforce in query/reducer logic
    pub downloaded_by: Option<String>, // FK → users.id (set null on delete). Null for anonymous downloads.
    pub share_link_id: Option<String>, // FK → share_links.id (set null on delete)
    pub preset_id: Option<String>,     // FK → download_presets.id (set null on delete)
    pub format: String,
    pub file_size: i64,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,

    // Index: downloaded_at — enforce in query/reducer logic
    pub downloaded_at: Timestamp,
}
