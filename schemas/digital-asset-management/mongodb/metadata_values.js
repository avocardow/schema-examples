// metadata_values: Actual metadata field values assigned to assets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const metadataValueSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    schema_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MetadataSchema",
      required: true,
    },
    value: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Indexes
metadataValueSchema.index({ asset_id: 1, schema_id: 1 }, { unique: true });
metadataValueSchema.index({ schema_id: 1 });

module.exports = mongoose.model("MetadataValue", metadataValueSchema);
