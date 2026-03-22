// notification_channels: Configured delivery provider instances for each channel type.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ChannelType {
    Email,
    Sms,
    Push,
    InApp,
    Chat,
    Webhook,
}
// type: String

#[spacetimedb::table(name = notification_channels, public)]
pub struct NotificationChannel {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub channel_type: ChannelType,

    pub provider: String, // e.g. "sendgrid", "twilio", "fcm", "slack", "custom"

    pub name: String, // Display name (e.g., "SendGrid Production", "Twilio SMS")

    // ⚠️  Provider credentials MUST be encrypted at rest.
    pub credentials: String, // JSON — API keys, auth tokens, webhook secrets.

    pub is_active: bool,   // Toggle a provider on/off without deleting its configuration.
    pub is_primary: bool,  // Default provider for this channel type (one per channel_type).
    pub priority: i32,     // Failover priority: lower number = higher priority.

    pub config: Option<String>, // JSON — provider-specific configuration beyond credentials.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
