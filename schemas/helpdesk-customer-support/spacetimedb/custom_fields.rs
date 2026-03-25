// custom_fields: User-defined fields that extend tickets with custom data.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum CustomFieldType {
    Text, // type: String
    Number,
    Date,
    Dropdown,
    Checkbox,
    Textarea,
    Url,
    Email,
}

#[spacetimedb::table(name = custom_fields, public)]
pub struct CustomField {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    // Unique: name — enforce in application
    pub label: String,
    pub field_type: CustomFieldType,
    pub sort_order: i32,
    pub is_required: bool,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
