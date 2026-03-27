// conversions: Tracks completed referral conversions with amounts, statuses, and approval.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const conversionSchema = new mongoose.Schema(
  {
    referral_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Referral",
      required: true,
    },
    affiliate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
    },
    external_id: { type: String, default: null },
    reference_type: { type: String, default: null },
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "reversed"],
      required: true,
      default: "pending",
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    approved_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

conversionSchema.index({ referral_id: 1 });
conversionSchema.index({ affiliate_id: 1, status: 1 });
conversionSchema.index({ external_id: 1 });
conversionSchema.index({ status: 1 });
conversionSchema.index({ created_at: 1 });

module.exports = mongoose.model("Conversion", conversionSchema);
