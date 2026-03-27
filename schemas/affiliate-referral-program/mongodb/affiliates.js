// affiliates: Links users to programs as affiliates with referral and payout details.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referral_code: { type: String, required: true, unique: true },
    coupon_code: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "rejected"],
      required: true,
      default: "pending",
    },
    custom_commission_rate: { type: Number, default: null },
    payout_method: { type: String, default: null },
    payout_email: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    referred_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      default: null,
    },
    approved_at: { type: Date, default: null },
    suspended_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

affiliateSchema.index({ program_id: 1, user_id: 1 }, { unique: true });
affiliateSchema.index({ user_id: 1 });
affiliateSchema.index({ status: 1 });
affiliateSchema.index({ referred_by: 1 });

module.exports = mongoose.model("Affiliate", affiliateSchema);
