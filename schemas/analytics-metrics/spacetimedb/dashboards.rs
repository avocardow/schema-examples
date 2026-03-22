// dashboards: Configurable dashboard layouts with visibility and auto-refresh settings.
// See README.md for full design rationale.

// Uses Visibility from saved_reports.rs — do not redefine here.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = dashboards, public)]
pub struct Dashboard {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,
    pub layout: Option<String>, // JSON
    #[index(btree)]
    pub visibility: Visibility,

    #[index(btree)]
    pub is_default: bool,

    pub refresh_interval: Option<i32>,

    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
