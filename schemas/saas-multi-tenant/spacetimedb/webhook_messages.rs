// webhook_messages: Stores inbound/outbound webhook event messages per organization.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = webhook_messages, public)]
pub struct WebhookMessage {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub event_type_id: String, // UUID — FK → webhook_event_types.id (restrict delete)

    #[index(btree)]
    pub event_id: String,

    pub payload: String, // JSON stored as string

    pub created_at: Timestamp,

    // Composite index (organization_id, created_at) — not supported inline;
    // organization_id indexed individually above.
}
