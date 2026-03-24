// deal_contacts: Join table linking deals to contacts with stakeholder roles.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const dealContactsSchema = new mongoose.Schema(
  {
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", required: true },
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true },
    role: {
      type: String,
      enum: ["decision_maker", "champion", "influencer", "end_user", "other"],
      required: true,
      default: "other",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

dealContactsSchema.index({ deal_id: 1, contact_id: 1 }, { unique: true });
dealContactsSchema.index({ contact_id: 1 });

module.exports = mongoose.model("DealContact", dealContactsSchema);
