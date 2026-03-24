// custom_field_values: Stored values of custom fields for individual tasks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = custom_field_values, public)]
pub struct CustomFieldValue {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub custom_field_id: String, // UUID — FK → custom_fields.id (cascade delete)
    pub value: String,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite unique: (task_id, custom_field_id)
}
