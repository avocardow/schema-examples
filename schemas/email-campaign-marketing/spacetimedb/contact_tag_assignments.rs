// contact_tag_assignments: Junction table linking contacts to tags.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = contact_tag_assignments, public)]
pub struct ContactTagAssignment {
    #[primary_key]
    pub id: String, // UUID

    pub contact_id: String, // UUID, FK → contacts.id (cascade delete)

    #[index(btree)]
    pub tag_id: String, // UUID, FK → tags.id (cascade delete)
    // Composite unique: (contact_id, tag_id) — enforce in reducer logic

    pub created_at: Timestamp,
}
