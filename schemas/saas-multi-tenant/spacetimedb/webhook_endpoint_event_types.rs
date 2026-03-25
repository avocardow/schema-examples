// webhook_endpoint_event_types: Maps webhook endpoints to their subscribed event types.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = webhook_endpoint_event_types, public)]
pub struct WebhookEndpointEventType {
    #[primary_key]
    pub id: String, // UUID, auto-generated in reducer logic

    #[index(btree)]
    pub endpoint_id: String, // UUID — FK → webhook_endpoints.id (cascade delete)

    #[index(btree)]
    pub event_type_id: String, // UUID — FK → webhook_event_types.id (cascade delete)

    pub created_at: Timestamp,

    // Composite unique: (endpoint_id, event_type_id) — enforce in reducer logic.
}
