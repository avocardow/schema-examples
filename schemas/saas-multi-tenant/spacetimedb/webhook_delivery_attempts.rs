// webhook_delivery_attempts: Tracks each delivery attempt for a webhook message to an endpoint.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum WebhookDeliveryStatus {
    Pending, // type: String
    Success,
    Failed,
}

#[spacetimedb::table(name = webhook_delivery_attempts, public)]
pub struct WebhookDeliveryAttempt {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub message_id: String, // UUID — FK → webhook_messages.id (cascade delete)

    #[index(btree)]
    pub endpoint_id: String, // UUID — FK → webhook_endpoints.id (cascade delete)

    pub attempt_number: i32, // default 1, enforced in reducer logic

    #[index(btree)]
    pub status: WebhookDeliveryStatus, // default: Pending

    pub http_status: Option<i32>,

    pub response_body: Option<String>,

    pub error_message: Option<String>,

    pub attempted_at: Option<Timestamp>,

    pub duration_ms: Option<i32>,

    #[index(btree)]
    pub next_retry_at: Option<Timestamp>,

    pub created_at: Timestamp,

    // Composite indexes not supported inline; approximated by individual btree indexes above:
    // index(message_id, attempt_number)
    // index(endpoint_id, created_at)
    // index(status, next_retry_at)
}
