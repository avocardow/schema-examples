// file_metadata_fields: Custom metadata field definitions with type information for application-level validation.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const fileMetadataFieldsSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true }, // Machine-readable key (e.g., "invoice_number", "project_code").
    label: { type: String, required: true }, // Human-readable display name (e.g., "Invoice Number", "Project Code").

    // Determines validation rules applied at the application layer.
    // string = free text. integer/float = numeric validation. boolean = true/false.
    // date = ISO 8601 date string. url = URL format validation. select = must match an options[] value.
    field_type: {
      type: String,
      enum: ["string", "integer", "float", "boolean", "date", "url", "select"],
      required: true,
    },

    description: { type: String }, // Explain what this field is for or how to fill it in.

    // If true, every file must have a value for this field.
    // Enforced at the application layer, not as a DB constraint.
    is_required: { type: Boolean, required: true, default: false },

    default_value: { type: String }, // Default value for new files. Stored as text, same as values.

    // For select-type fields: array of valid values.
    // e.g., ["low", "medium", "high"] or ["draft", "final", "archived"].
    // Null for non-select types.
    options: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("FileMetadataField", fileMetadataFieldsSchema);
