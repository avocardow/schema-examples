// custom_fields: User-defined field definitions for extending tickets with custom data.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    field_type: {
      type: String,
      enum: ["text", "number", "date", "dropdown", "checkbox", "textarea", "url", "email"],
      required: true,
    },
    sort_order: { type: Number, required: true, default: 0 },
    is_required: { type: Boolean, required: true, default: false },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customFieldsSchema.index({ name: 1 }, { unique: true });
customFieldsSchema.index({ sort_order: 1 });

module.exports = mongoose.model("CustomField", customFieldsSchema);
