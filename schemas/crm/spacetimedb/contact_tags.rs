// contact_tags: Join table linking contacts to tags.
// See README.md for full design rationale.
// Composite unique: (contact_id, tag_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = contact_tags, public)]
pub struct ContactTag {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub contact_id: String, // UUID — FK → contacts.id (cascade delete)
    #[index(btree)]
    pub tag_id: String, // UUID — FK → tags.id (cascade delete)
    pub created_at: Timestamp,
}
