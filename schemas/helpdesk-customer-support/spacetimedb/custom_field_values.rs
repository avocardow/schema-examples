// custom_field_values: Stored values for custom fields on specific tickets.
// See README.md for full design rationale.

#[spacetimedb::table(name = custom_field_values, public)]
pub struct CustomFieldValue {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub custom_field_id: String, // UUID — FK → custom_fields.id (cascade delete)
    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)
    // Composite unique: (custom_field_id, ticket_id) — enforce in application
    pub value: Option<String>,
}
