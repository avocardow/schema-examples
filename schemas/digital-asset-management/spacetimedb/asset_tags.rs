// asset_tags: Join table linking assets to tags.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(asset_id, tag_id) — enforce in reducer logic

#[spacetimedb::table(name = asset_tags, public)]
pub struct AssetTag {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    #[index(btree)]
    pub tag_id: String, // FK → tags.id (cascade delete)

    pub assigned_by: String, // FK → users.id (restrict delete)

    pub assigned_at: Timestamp,
}
