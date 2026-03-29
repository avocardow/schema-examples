// metadata_schemas: Custom metadata field definitions per workspace.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const metadataSchemaSchema = new mongoose.Schema(
  {
    workspace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    field_name: { type: String, required: true },
    field_label: { type: String, required: true },
    field_type: {
      type: String,
      required: true,
      enum: ["text", "number", "date", "boolean", "single_select", "multi_select"],
    },
    options: { type: mongoose.Schema.Types.Mixed, default: null },
    is_required: { type: Boolean, required: true, default: false },
    display_order: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
metadataSchemaSchema.index(
  { workspace_id: 1, field_name: 1 },
  { unique: true }
);

module.exports = mongoose.model("MetadataSchema", metadataSchemaSchema);
