// tenant_integrations: Third-party integrations connected by each tenant organization.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TenantIntegrationStatus {
    Active, // type: String
    Inactive,
    Error,
}

#[spacetimedb::table(name = tenant_integrations, public)]
pub struct TenantIntegration {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub integration_id: String, // UUID — FK → integration_definitions.id (restrict delete)

    #[index(btree)]
    pub status: TenantIntegrationStatus, // default: Active

    pub encrypted_credentials: Option<String>, // JSON
    pub config: Option<String>, // JSON

    pub connected_by: String, // UUID — FK → users.id (restrict delete)

    pub last_synced_at: Option<Timestamp>,
    pub error_message: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // Composite unique: (organization_id, integration_id) — not supported inline, enforce in reducer logic.
}
