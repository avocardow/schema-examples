// notification_topics: Named pub/sub groups for fan-out delivery.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = notification_topics, public)]
pub struct NotificationTopic {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
