// notification_preference_defaults: System-level and tenant-level default preferences.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PreferenceScope {
    System,
    Tenant,
}
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
// type: String

#[spacetimedb::table(name = notification_preference_defaults, public)]
pub struct NotificationPreferenceDefault {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub scope: PreferenceScope,

    // The tenant/org ID. Null when scope = "system".
    #[index(btree)]
    pub scope_id: Option<String>,

    // Category scope: null = applies to all categories.
    pub category_id: Option<String>, // UUID — FK → notification_categories.id (cascade delete)

    // Channel scope: null = applies to all channels.
    pub channel_type: Option<ChannelType>,

    pub enabled: bool,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // unique(scope, scope_id, category_id, channel_type) — enforced at application level.
    // index(scope, scope_id) — composite index enforced at application level.
}
