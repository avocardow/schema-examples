// file_metadata_fields: Custom metadata field definitions with type information for application-level validation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Determines validation rules applied at the application layer.
// string = free text. integer/float = numeric validation. boolean = true/false.
// date = ISO 8601 date string. url = URL format validation. select = must match an options[] value.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum FileMetadataFieldType {
    String,
    Integer,
    Float,
    Boolean,
    Date,
    Url,
    Select,
}

#[spacetimedb::table(name = file_metadata_fields, public)]
pub struct FileMetadataField {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String, // Machine-readable key (e.g., "invoice_number", "project_code").

    pub label: String, // Human-readable display name (e.g., "Invoice Number", "Project Code").

    pub field_type: FileMetadataFieldType,

    pub description: Option<String>,

    // If true, every file must have a value for this field.
    // Enforced at the application layer, not as a DB constraint.
    pub is_required: bool,

    pub default_value: Option<String>, // Default value for new files. Stored as text, same as values.

    // For select-type fields: JSON array of valid values. Null for non-select types.
    pub options: Option<String>, // JSON

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
