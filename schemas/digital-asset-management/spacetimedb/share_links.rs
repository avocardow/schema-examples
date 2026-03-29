// share_links: Shareable links for assets or collections with optional access controls.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Index on asset_id (Option<String>) — enforce via query pattern
// Index on collection_id (Option<String>) — enforce via query pattern

#[spacetimedb::table(name = share_links, public)]
pub struct ShareLink {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    // Index: asset_id — enforce in query/reducer logic
    pub asset_id: Option<String>,      // FK → assets.id (cascade delete)
    // Index: collection_id — enforce in query/reducer logic
    pub collection_id: Option<String>, // FK → collections.id (cascade delete)

    #[unique]
    pub token: String,

    pub password_hash: Option<String>,
    pub allow_download: bool,
    // Index: expires_at — enforce in query/reducer logic
    pub expires_at: Option<Timestamp>,
    pub view_count: i32, // default 0
    pub max_views: Option<i32>,

    pub created_by: String, // FK → users.id (cascade delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
