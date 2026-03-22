// notification_template_contents: Per-channel content variants for a template.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// type: String
#[derive(SpacetimeType, Clone)]
pub enum ChannelType {
    Email,
    Sms,
    Push,
    InApp,
    Chat,
    Webhook,
}

#[spacetimedb::table(name = notification_template_contents, public)]
pub struct NotificationTemplateContent {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub template_id: String, // FK → notification_templates.id (cascade delete)

    // Which channel this content is for.
    pub channel_type: ChannelType,

    // Email subject, push title. Not applicable for SMS or webhook.
    pub subject: Option<String>,

    // The main content. HTML for email, plain text for SMS, structured for in-app.
    pub body: String,

    // Channel-specific metadata as JSON. Keeps the table clean while supporting provider-specific fields.
    // Email: { "preheader": "...", "reply_to": "...", "from_name": "..." }
    // Push: { "icon": "...", "sound": "default", "badge_count": 1, "image_url": "..." }
    // In-app: { "blocks": [...], "cta": { "url": "...", "label": "..." } }
    // SMS: { "sender_id": "..." }
    // Webhook: { "method": "POST", "headers": {...} }
    pub metadata: Option<String>, // JSON

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // Unique constraint: (template_id, channel_type) — one content variant per channel per template.
    // SpacetimeDB does not enforce composite unique constraints; enforce in application logic.
}
