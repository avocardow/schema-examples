// file_metadata_values: Custom metadata values per file — each row stores one field's value for one file.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = file_metadata_values, public)]
pub struct FileMetadataValue {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub file_id: String, // FK → files.id (cascade delete)

    #[index(btree)]
    pub field_id: String, // FK → file_metadata_fields.id (cascade delete)

    // The actual value, stored as text regardless of field_type.
    // Application validates against field_type before saving.
    // None means "explicitly empty".
    pub value: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // unique(file_id, field_id) — enforced at application level.
    // index(field_id, value) — composite index enforced at application level.
}
