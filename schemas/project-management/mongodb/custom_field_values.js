// custom_field_values: Stores task-specific values for custom fields.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldValuesSchema = new mongoose.Schema(
  {
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    custom_field_id: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", required: true },
    value: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customFieldValuesSchema.index({ task_id: 1, custom_field_id: 1 }, { unique: true });
customFieldValuesSchema.index({ custom_field_id: 1 });

module.exports = mongoose.model("CustomFieldValue", customFieldValuesSchema);
