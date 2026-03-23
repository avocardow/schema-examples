// message_reactions: tracks emoji reactions by users on messages.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique (message_id, user_id, emoji) is enforced at the application layer;
// SpacetimeDB does not support composite unique constraints in the schema.

#[spacetimedb::table(name = message_reactions, public)]
pub struct MessageReaction {
    #[primary_key]
    pub id: String, // UUID

    // FK -> messages(id) ON DELETE CASCADE (enforced at application layer)
    #[index(btree)]
    pub message_id: String, // UUID

    // FK -> users(id) ON DELETE CASCADE (enforced at application layer)
    #[index(btree)]
    pub user_id: String, // UUID

    pub emoji: String,

    pub created_at: Timestamp, // microseconds since UNIX epoch; default: now
}
