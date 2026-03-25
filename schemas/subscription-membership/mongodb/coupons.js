// coupons: Discount codes and their redemption rules.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const couponsSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true, default: null },
    name: { type: String, required: true },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed_amount"],
      required: true,
    },
    discount_value: { type: Number, required: true },
    currency: { type: String, default: null },
    duration: {
      type: String,
      enum: ["once", "repeating", "forever"],
      required: true,
      default: "once",
    },
    duration_in_months: { type: Number, default: null },
    max_redemptions: { type: Number, default: null },
    times_redeemed: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
    valid_from: { type: Date, default: null },
    valid_until: { type: Date, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

couponsSchema.index({ is_active: 1 });
couponsSchema.index({ provider_type: 1, provider_id: 1 });

module.exports = mongoose.model("Coupon", couponsSchema);
