// notification_delivery_attempts: Per-notification, per-channel delivery attempt log with full audit trail and retry tracking.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// Delivery lifecycle status. Progresses forward; mutually exclusive.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum DeliveryAttemptStatus {
    Pending,   // Attempt created, not yet processed.
    Queued,    // In the delivery queue, waiting to be sent.
    Sent,      // Handed off to the provider (provider accepted the request).
    Delivered, // Provider confirmed delivery to the recipient.
    Bounced,   // Provider reported a bounce (email bounced, push token invalid, etc.).
    Failed,    // Provider returned an error or max retries exhausted.
}

#[spacetimedb::table(name = notification_delivery_attempts, public)]
pub struct NotificationDeliveryAttempt {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub notification_id: String, // FK → notifications.id (cascade delete)

    #[index(btree)]
    pub channel_id: String, // FK → notification_channels.id (restrict delete)

    #[index(btree)]
    pub status: DeliveryAttemptStatus, // Default: Pending

    #[index(btree)]
    pub provider_message_id: Option<String>, // e.g., SendGrid "X-Message-Id", Twilio "SM..." SID.

    pub provider_response: Option<String>, // JSON — raw provider response for debugging.

    pub error_code: Option<String>,    // Provider-specific error code (e.g., "550", "InvalidRegistration").
    pub error_message: Option<String>, // Human-readable error description.

    pub attempt_number: i32, // Which attempt this is (1 = first try, 2 = first retry, etc.). Default: 1

    pub next_retry_at: Option<Timestamp>, // When the next retry is scheduled. Null = no retry planned.

    pub sent_at: Option<Timestamp>,      // When the provider accepted the request.
    pub delivered_at: Option<Timestamp>,  // When delivery was confirmed (from provider webhook).

    #[index(btree)]
    pub created_at: Timestamp,

    pub updated_at: Timestamp, // Tracks the latest status transition.
}
