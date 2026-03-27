// referrals: Tracks referral visits, leads, and conversions tied to affiliates.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    affiliate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
      required: true,
    },
    click_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Click",
      default: null,
    },
    visitor_id: { type: String, default: null },
    email: { type: String, default: null },
    status: {
      type: String,
      enum: ["visit", "lead", "converted", "expired"],
      required: true,
      default: "visit",
    },
    landing_url: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    converted_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

referralSchema.index({ affiliate_id: 1, status: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ email: 1 });
referralSchema.index({ visitor_id: 1 });

module.exports = mongoose.model("Referral", referralSchema);
