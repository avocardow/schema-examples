// activities: Logged interactions such as calls, emails, and meetings linked to contacts, companies, deals, or leads.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const activitiesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["call", "email", "meeting"],
      required: true,
    },
    subject: { type: String, required: true },
    description: { type: String, default: null },
    occurred_at: { type: Date, required: true },
    duration: { type: Number, default: null },
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", default: null },
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", default: null },
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

activitiesSchema.index({ contact_id: 1, occurred_at: 1 });
activitiesSchema.index({ company_id: 1, occurred_at: 1 });
activitiesSchema.index({ deal_id: 1, occurred_at: 1 });
activitiesSchema.index({ lead_id: 1, occurred_at: 1 });
activitiesSchema.index({ owner_id: 1 });
activitiesSchema.index({ type: 1 });

module.exports = mongoose.model("Activity", activitiesSchema);
