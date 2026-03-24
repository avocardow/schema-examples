// notes: Free-text notes attached to contacts, companies, deals, or leads.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", default: null },
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

notesSchema.index({ contact_id: 1 });
notesSchema.index({ company_id: 1 });
notesSchema.index({ deal_id: 1 });
notesSchema.index({ lead_id: 1 });
notesSchema.index({ created_by: 1 });

module.exports = mongoose.model("Note", notesSchema);
