// collection_assets: Join table linking assets to collections with ordering.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(collection_id, asset_id) — enforce in reducer logic

#[spacetimedb::table(name = collection_assets, public)]
pub struct CollectionAsset {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub collection_id: String, // FK → collections.id (cascade delete)

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    pub position: i32, // default 0

    pub added_by: String, // FK → users.id (restrict delete)

    pub added_at: Timestamp,
}
