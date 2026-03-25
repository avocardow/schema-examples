// integration_definitions: Available integration types with auth method and configuration schema.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum IntegrationAuthMethod {
    Oauth2, // type: String
    ApiKey,
    Webhook,
    None,
}

#[spacetimedb::table(name = integration_definitions, public)]
pub struct IntegrationDefinition {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[unique]
    pub key: String,

    pub name: String,
    pub description: Option<String>,
    pub icon_url: Option<String>,

    pub auth_method: IntegrationAuthMethod,

    pub config_schema: Option<String>, // JSON stored as string

    #[index(btree)]
    pub is_enabled: bool, // default: true

    pub sort_order: i32, // default: 0

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
