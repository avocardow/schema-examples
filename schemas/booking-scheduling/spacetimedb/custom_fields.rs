// custom_fields: Configurable intake form fields attached to services.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum CustomFieldType {
    Text, // type: String
    Textarea,
    Select,
    MultiSelect,
    Checkbox,
    Number,
    Date,
    Phone,
    Email,
}

#[spacetimedb::table(name = custom_fields, public)]
pub struct CustomField {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub service_id: String, // UUID — FK → services.id (cascade delete)
    pub label: String,
    pub field_type: CustomFieldType,
    pub placeholder: Option<String>,
    pub is_required: bool,
    pub options: Option<String>, // JSON
    pub position: i32,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (service_id, position)
}
