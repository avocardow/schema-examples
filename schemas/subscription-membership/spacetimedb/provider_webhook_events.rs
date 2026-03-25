// provider_webhook_events: Incoming webhook events from payment providers.
// See README.md for full design rationale.
// Composite unique: (provider_type, provider_event_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = provider_webhook_events, public)]
pub struct ProviderWebhookEvent {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub provider_type: String,
    #[unique]
    pub provider_event_id: String,
    #[index(btree)]
    pub event_type: String,
    pub payload: String, // JSON
    pub processed_at: Option<Timestamp>,
    pub processing_error: Option<String>,
    pub created_at: Timestamp,
}
