// event_types: Catalog of trackable event types with optional JSON schema validation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = event_types, public)]
pub struct EventType {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String,

    #[index(btree)]
    pub category: Option<String>,

    pub display_name: String,
    pub description: Option<String>,

    #[index(btree)]
    pub is_active: bool,

    pub schema: Option<String>, // JSON
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
