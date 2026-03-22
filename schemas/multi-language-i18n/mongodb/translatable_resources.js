// translatable_resources: Registry of entity types whose fields support content translation.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const translatableResourcesSchema = new mongoose.Schema(
  {
    resource_type: { type: String, unique: true, required: true },
    display_name: { type: String, required: true },
    translatable_fields: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String },
    is_enabled: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("TranslatableResource", translatableResourcesSchema);
