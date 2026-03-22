// notification_subscriptions: Links users to topics with per-channel granularity for fan-out delivery.
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

#[spacetimedb::table(name = notification_subscriptions, public)]
pub struct NotificationSubscription {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    #[index(btree)]
    pub topic_id: String, // FK → notification_topics.id (cascade delete)

    // Channel scope: null = subscribed on all channels.
    // Set to a specific channel to subscribe only that channel.
    pub channel_type: Option<ChannelType>,

    pub created_at: Timestamp,

    // unique(user_id, topic_id, channel_type) — enforced at application level.
}
