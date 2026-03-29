// asset_licenses: Join table linking assets to licenses with effective dates.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = asset_licenses, public)]
pub struct AssetLicense {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    #[index(btree)]
    pub license_id: String, // FK → licenses.id (cascade delete)

    pub effective_date: String, // YYYY-MM-DD

    #[index(btree)]
    pub expiry_date: Option<String>, // YYYY-MM-DD

    pub notes: Option<String>,

    pub assigned_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
