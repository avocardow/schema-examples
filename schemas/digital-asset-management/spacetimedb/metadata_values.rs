// metadata_values: Stored values for custom metadata fields on assets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(asset_id, schema_id) — enforce in reducer logic

#[spacetimedb::table(name = metadata_values, public)]
pub struct MetadataValue {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    #[index(btree)]
    pub schema_id: String, // FK → metadata_schemas.id (cascade delete)

    pub value: String,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
