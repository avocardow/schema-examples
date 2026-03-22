// file_tag_assignments: Many-to-many join between files and tags with audit trail.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = file_tag_assignments, public)]
pub struct FileTagAssignment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub file_id: String, // FK → files.id (cascade delete)

    #[index(btree)]
    pub tag_id: String, // FK → file_tags.id (cascade delete)

    #[index(btree)]
    pub tagged_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
}

// Unique constraint on (file_id, tag_id) enforced at the application layer.
// SpacetimeDB supports unique on single columns; composite uniqueness requires app-level enforcement.
