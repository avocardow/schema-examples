// custom_field_options: Selectable options for select and multi-select custom fields.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldOptionsSchema = new mongoose.Schema(
  {
    custom_field_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomField",
      required: true,
    },
    value: { type: String, required: true },
    color: { type: String, default: null },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

customFieldOptionsSchema.index({ custom_field_id: 1, position: 1 });

module.exports = mongoose.model("CustomFieldOption", customFieldOptionsSchema);
