// translatable_resources: Resource types that support content translation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = translatable_resources, public)]
pub struct TranslatableResource {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub resource_type: String,

    pub display_name: String,
    pub translatable_fields: String, // JSON
    pub description: Option<String>,
    pub is_enabled: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
