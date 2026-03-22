// email_suppression_list: Email addresses that should not be sent to. Prevents bounces, spam complaints, and unwanted mail.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// Why this address is suppressed.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum SuppressionReason {
    HardBounce,       // Mailbox doesn't exist (permanent). Never send again.
    SoftBounce,       // Temporary delivery failure. May clear after a cooling period.
    SpamComplaint,    // Recipient marked your email as spam. Never send again.
    ManualUnsubscribe, // User clicked unsubscribe link. Respect immediately.
    InvalidAddress,   // Address format is invalid or domain doesn't exist.
}

// How this suppression was created.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum SuppressionSource {
    ProviderWebhook, // Bounce/complaint webhook from SendGrid, Postmark, etc.
    UserAction,      // User clicked unsubscribe link in your app.
    Admin,           // Manually added by an admin.
    System,          // Automated detection (e.g., repeated soft bounces promoted to hard bounce).
}

#[spacetimedb::table(name = email_suppression_list, public)]
pub struct EmailSuppressionEntry {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub email: String, // The suppressed email address. Lowercase, trimmed.

    #[index(btree)]
    pub reason: SuppressionReason,

    pub source: SuppressionSource,

    pub channel_id: Option<String>, // UUID — FK → notification_channels.id (set null on delete)

    pub details: Option<String>, // JSON blob: bounce_type, provider_message, original_message_id, etc.

    pub suppressed_at: Timestamp, // When the suppression took effect. May differ from created_at if back-dated.

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // Null = permanent suppression. Set for soft bounces that should be retried.

    pub created_at: Timestamp,

    // Unique constraint: (email, reason) — one entry per email per reason.
    // SpacetimeDB does not enforce composite unique constraints; enforce in application logic.
}
