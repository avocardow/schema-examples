// custom_field_options: Selectable choices for dropdown custom fields.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldOptionsSchema = new mongoose.Schema(
  {
    custom_field_id: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: false }
);

customFieldOptionsSchema.index({ custom_field_id: 1, sort_order: 1 });

module.exports = mongoose.model("CustomFieldOption", customFieldOptionsSchema);
