// message_read_receipts: tracks per-user delivery and read status for each message.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// composite_unique(message_id, user_id) -- enforced at application level in SpacetimeDB
// message_id references messages(id) on delete cascade -- enforced at application level
// user_id references users(id) on delete cascade -- enforced at application level

#[spacetimedb::table(name = message_read_receipts, public)]
pub struct MessageReadReceipt {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub message_id: String, // UUID, FK -> messages(id)

    #[index(btree)]
    pub user_id: String, // UUID, FK -> users(id)

    // composite index(user_id, read_at) -- enforced at application level in SpacetimeDB
    pub delivered_at: Option<Timestamp>,
    pub read_at: Option<Timestamp>,

    pub created_at: Timestamp,
}
