// bookmarked_messages: stores per-user bookmarks on messages, with an optional personal note.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// composite_unique(user_id, message_id) -- enforced at application level
// index(user_id, created_at) -- see #[index(btree)] on user_id below

#[spacetimedb::table(name = bookmarked_messages, public)]
pub struct BookmarkedMessage {
    #[primary_key]
    pub id: String, // UUID

    // FK -> users(id) ON DELETE CASCADE (enforced at application level)
    #[index(btree)]
    pub user_id: String, // UUID

    // FK -> messages(id) ON DELETE CASCADE (enforced at application level)
    pub message_id: String, // UUID

    pub note: Option<String>,

    pub created_at: Timestamp, // Unix timestamp (microseconds)
}
