// file_attachments: Polymorphic join table — attach files to any entity in any domain.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = file_attachments, public)]
pub struct FileAttachment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub file_id: String, // FK → files.id (cascade delete)

    // Polymorphic target: what entity this file is attached to.
    // Not FKs — the target table depends on the consuming domain.
    #[index(btree)]
    pub record_type: String, // Entity type (e.g., "products", "users", "posts", "tickets").
    pub record_id: String,   // Entity primary key (UUID).

    pub name: String,     // Attachment slot/purpose (e.g., "avatar", "cover_image", "documents").
    pub position: i32,    // Ordering within a slot. Allows drag-and-drop reordering.
    pub created_at: Timestamp,
    // Attachments are immutable links. No updated_at.
}
// Composite unique(record_type, record_id, name, file_id) enforced at application level.
