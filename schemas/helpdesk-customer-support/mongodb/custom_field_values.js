// custom_field_values: Stored values for custom fields on individual tickets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const customFieldValuesSchema = new mongoose.Schema(
  {
    custom_field_id: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", required: true },
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    value: { type: String, default: null },
  },
  { timestamps: false }
);

customFieldValuesSchema.index({ custom_field_id: 1, ticket_id: 1 }, { unique: true });
customFieldValuesSchema.index({ ticket_id: 1 });

module.exports = mongoose.model("CustomFieldValue", customFieldValuesSchema);
