// workspaces: Top-level organizational unit for asset management.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = workspaces, public)]
pub struct Workspace {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,
    pub logo_url: Option<String>,

    pub storage_limit_bytes: Option<i64>,
    pub storage_used_bytes: i64, // default 0

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
