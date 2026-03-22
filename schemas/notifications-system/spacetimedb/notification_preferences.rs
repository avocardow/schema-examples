// notification_preferences: Per-user opt-in/opt-out controls for notification categories and channels.
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

#[spacetimedb::table(name = notification_preferences, public)]
pub struct NotificationPreference {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    // Category scope: null = global preference (applies to all categories without a specific pref).
    pub category_id: Option<String>, // UUID — FK → notification_categories.id (cascade delete)

    // Channel scope: null = all channels (applies to all channels without a specific pref).
    pub channel_type: Option<ChannelType>,

    // ⚠️  Does NOT override is_required categories. Check notification_categories.is_required first.
    pub enabled: bool,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // unique(user_id, category_id, channel_type) — enforced at application level.
    // index(user_id, category_id) — composite index enforced at application level.
}
