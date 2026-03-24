// custom_field_values: Stored values for custom fields on specific entity instances.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldValuesSchema = new mongoose.Schema(
  {
    custom_field_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomField",
      required: true,
    },
    entity_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    value: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customFieldValuesSchema.index({ custom_field_id: 1, entity_id: 1 }, { unique: true });
customFieldValuesSchema.index({ entity_id: 1 });

module.exports = mongoose.model("CustomFieldValue", customFieldValuesSchema);
