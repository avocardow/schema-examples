// collections: Curated groupings of assets within a workspace.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = collections, public)]
pub struct Collection {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    pub name: String,
    pub description: Option<String>,
    pub cover_asset_id: Option<String>, // FK → assets.id (set null on delete)

    pub is_public: bool, // default false
    pub asset_count: i32, // default 0

    #[index(btree)]
    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
