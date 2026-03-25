// webhook_event_types: Catalog of event types that can trigger webhook deliveries.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = webhook_event_types, public)]
pub struct WebhookEventType {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub key: String,

    pub name: String,
    pub description: Option<String>,

    #[index(btree)]
    pub is_enabled: bool,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
