// licenses: License definitions that can be attached to assets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum LicenseType {
    RoyaltyFree,       // type: String
    RightsManaged,
    Editorial,
    CreativeCommons,
    Internal,
    Custom,
}

#[spacetimedb::table(name = licenses, public)]
pub struct License {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    pub name: String,
    pub description: Option<String>,
    // Index: license_type — enforce in query/reducer logic (enum type, cannot use #[index(btree)])
    pub license_type: LicenseType,
    pub territories: Option<String>, // JSON stored as string
    pub channels: Option<String>,    // JSON stored as string
    pub max_uses: Option<i32>,

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
