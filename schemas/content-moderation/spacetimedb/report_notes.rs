// report_notes: Internal moderator notes on queue items.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = report_notes, public)]
pub struct ReportNote {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub queue_item_id: String, // UUID — FK → moderation_queue_items.id (cascade delete)

    #[index(btree)]
    pub moderator_id: String, // UUID — FK → users.id (restrict delete)

    pub content: String, // The note text. Internal-only, never shown to the reported user.

    pub created_at: Timestamp, // Append-only: notes are never edited. No updated_at.
}
