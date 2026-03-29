// metadata_schemas: Workspace-defined custom metadata field definitions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum MetadataFieldType {
    Text,          // type: String
    Number,
    Date,
    Boolean,
    SingleSelect,
    MultiSelect,
}

// Composite unique(workspace_id, field_name) — enforce in reducer logic

#[spacetimedb::table(name = metadata_schemas, public)]
pub struct MetadataSchema {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    pub field_name: String,
    pub field_label: String,
    pub field_type: MetadataFieldType,
    pub options: Option<String>, // JSON stored as string
    pub is_required: bool, // default false
    pub display_order: i32, // default 0

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
