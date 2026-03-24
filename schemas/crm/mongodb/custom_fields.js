// custom_fields: User-defined field definitions for extending CRM entities.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldsSchema = new mongoose.Schema(
  {
    entity_type: {
      type: String,
      enum: ["contact", "company", "deal", "lead"],
      required: true,
    },
    name: { type: String, required: true },
    field_type: {
      type: String,
      enum: ["text", "number", "date", "select", "multi_select", "checkbox", "url"],
      required: true,
    },
    description: { type: String, default: null },
    is_required: { type: Boolean, required: true, default: false },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customFieldsSchema.index({ entity_type: 1, position: 1 });

module.exports = mongoose.model("CustomField", customFieldsSchema);
