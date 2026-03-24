// custom_fields: Configurable intake form fields for services.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldsSchema = new mongoose.Schema(
  {
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    label: { type: String, required: true },
    field_type: {
      type: String,
      enum: ["text", "textarea", "select", "multi_select", "checkbox", "number", "date", "phone", "email"],
      required: true,
    },
    placeholder: { type: String, default: null },
    is_required: { type: Boolean, required: true, default: false },
    options: { type: mongoose.Schema.Types.Mixed, default: null },
    position: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

customFieldsSchema.index({ service_id: 1, position: 1 });

module.exports = mongoose.model("CustomField", customFieldsSchema);
