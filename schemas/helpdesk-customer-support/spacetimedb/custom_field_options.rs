// custom_field_options: Selectable choices for dropdown custom fields.
// See README.md for full design rationale.

#[spacetimedb::table(name = custom_field_options, public)]
pub struct CustomFieldOption {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub custom_field_id: String, // UUID — FK → custom_fields.id (cascade delete)
    pub label: String,
    pub value: String,
    pub sort_order: i32,
}
