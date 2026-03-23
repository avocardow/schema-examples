// message_attachments: files attached to chat messages, linking messages to stored file records.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = message_attachments, public)]
pub struct MessageAttachment {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub message_id: String, // UUID — FK → messages.id (cascade delete)
    #[index(btree)]
    pub file_id: String, // UUID — FK → files.id (restrict delete)
    pub file_name: String,
    pub file_size: i64,
    pub mime_type: String,
    pub position: i32,
    pub created_at: Timestamp,
}
