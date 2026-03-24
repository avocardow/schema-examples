// custom_fields: User-defined field definitions for extending task data.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum CustomFieldType {
    Text, // type: String
    Number,
    Date,
    Select,
    MultiSelect,
    Checkbox,
    Url,
}

#[spacetimedb::table(name = custom_fields, public)]
pub struct CustomField {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    pub name: String,
    pub field_type: CustomFieldType,
    pub description: Option<String>,
    pub is_required: bool,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (project_id, position)
}
