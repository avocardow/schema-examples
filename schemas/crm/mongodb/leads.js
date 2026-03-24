// leads: Prospective contacts before conversion into full contacts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const leadsSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, default: null },
    company_name: { type: String, default: null },
    title: { type: String, default: null },
    source: {
      type: String,
      enum: [
        "web",
        "referral",
        "organic",
        "paid",
        "social",
        "event",
        "cold_outreach",
        "other",
      ],
      default: null,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "unqualified", "converted"],
      required: true,
      default: "new",
    },
    converted_at: { type: Date, default: null },
    converted_contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contact",
      default: null,
    },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

leadsSchema.index({ status: 1 });
leadsSchema.index({ owner_id: 1 });
leadsSchema.index({ source: 1 });

module.exports = mongoose.model("Lead", leadsSchema);
