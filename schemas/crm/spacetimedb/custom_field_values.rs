// custom_field_values: Stored values for custom fields on specific entities.
// See README.md for full design rationale.
// Composite unique: (custom_field_id, entity_id) — enforce in reducer logic

use spacetimedb::Timestamp;

#[spacetimedb::table(name = custom_field_values, public)]
pub struct CustomFieldValue {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub custom_field_id: String, // UUID — FK → custom_fields.id (cascade delete)
    #[index(btree)]
    pub entity_id: String, // UUID — polymorphic reference to contact/company/deal/lead
    pub value: String,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
