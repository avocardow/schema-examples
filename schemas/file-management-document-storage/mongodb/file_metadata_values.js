// file_metadata_values: Custom metadata values per file — each row stores one field's value for one file.
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const fileMetadataValuesSchema = new mongoose.Schema(
  {
    file_id: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
      // The file this metadata belongs to. Cascade: deleting a file removes all its metadata values.
    field_id: { type: mongoose.Schema.Types.ObjectId, ref: "FileMetadataField", required: true },
      // Which metadata field this value is for. Cascade: deleting a field definition removes all its values.

    // The actual value, stored as text regardless of field_type.
    // Application validates against field_type before saving.
    // Null means "explicitly empty".
    value: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// One value per field per file.
fileMetadataValuesSchema.index({ file_id: 1, field_id: 1 }, { unique: true });

// "All files where invoice_number = 'INV-2024-001'."
fileMetadataValuesSchema.index({ field_id: 1, value: 1 });

module.exports = mongoose.model("FileMetadataValue", fileMetadataValuesSchema);
