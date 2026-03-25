// ticket_attachments: Files attached to ticket messages with metadata.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = ticket_attachments, public)]
pub struct TicketAttachment {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)
    #[index(btree)]
    pub message_id: Option<String>, // UUID — FK → ticket_messages.id (set null)
    pub file_name: String,
    pub file_url: String,
    pub file_size: Option<i32>,
    pub mime_type: Option<String>,
    pub uploaded_by: String, // UUID — FK → users.id (restrict)
    pub created_at: Timestamp,
}
