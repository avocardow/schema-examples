// message_mentions: tracks @user, @channel, and @all mentions within a message.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum MentionType {
    User, // type: String
    Channel,
    All,
}

// composite_unique(message_id, mentioned_user_id, mention_type) — enforced at application level;
// SpacetimeDB does not support composite unique constraints declaratively.
#[spacetimedb::table(name = message_mentions, public)]
pub struct MessageMention {
    #[primary_key]
    pub id: String, // UUID

    // FK → messages.id (cascade delete)
    #[index(btree)]
    pub message_id: String, // UUID

    // FK → users.id (cascade delete)
    #[index(btree)]
    pub mentioned_user_id: Option<String>, // UUID, nullable

    pub mention_type: MentionType,

    pub created_at: Timestamp, // microseconds since Unix epoch; default: current time
}
