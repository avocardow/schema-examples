// custom_field_options: Selectable options for select/multi-select custom fields.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = custom_field_options, public)]
pub struct CustomFieldOption {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub custom_field_id: String, // UUID — FK → custom_fields.id (cascade delete)
    pub value: String,
    pub color: Option<String>,
    pub position: i32,
    pub created_at: Timestamp,
}
