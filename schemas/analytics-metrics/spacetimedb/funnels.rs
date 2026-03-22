// funnels: Multi-step conversion funnels with configurable time windows.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = funnels, public)]
pub struct Funnel {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,
    pub conversion_window: i32,

    #[index(btree)]
    pub is_active: bool,

    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
