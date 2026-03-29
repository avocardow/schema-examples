// asset_activities: Audit trail of actions performed on assets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum AssetActivityAction {
    Uploaded,    // type: String
    Updated,
    Downloaded,
    Shared,
    Commented,
    Tagged,
    Moved,
    Versioned,
    Archived,
    Restored,
    Deleted,
}

#[spacetimedb::table(name = asset_activities, public)]
pub struct AssetActivity {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    // Index: asset_id — enforce in query/reducer logic
    pub asset_id: Option<String>, // FK → assets.id (set null on delete)

    #[index(btree)]
    pub actor_id: String, // FK → users.id (restrict delete)

    // Index: action — enforce in query/reducer logic (enum type, cannot use #[index(btree)])
    pub action: AssetActivityAction,
    pub details: Option<String>, // JSON stored as string

    // Index: occurred_at — enforce in query/reducer logic
    pub occurred_at: Timestamp,
}
