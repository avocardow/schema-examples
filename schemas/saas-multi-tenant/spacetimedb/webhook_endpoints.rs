// webhook_endpoints: Registered webhook endpoints per organization with delivery tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum WebhookEndpointStatus {
    Active, // type: String
    Paused,
    Disabled,
}

#[spacetimedb::table(name = webhook_endpoints, public)]
pub struct WebhookEndpoint {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    pub url: String,
    pub description: Option<String>,
    pub signing_secret: String,

    #[index(btree)]
    pub status: WebhookEndpointStatus, // default: Active

    pub failure_count: i32, // default: 0
    pub last_success_at: Option<Timestamp>,
    pub last_failure_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
