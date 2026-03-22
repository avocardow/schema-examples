// saved_reports: Persisted report configurations with visibility controls.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum Visibility {
    Private, // type: String
    Team,
    Public,
}

#[spacetimedb::table(name = saved_reports, public)]
pub struct SavedReport {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,
    pub config: String, // JSON
    #[index(btree)]
    pub visibility: Visibility,

    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (cascade delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
