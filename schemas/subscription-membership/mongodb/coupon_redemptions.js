// coupon_redemptions: Records of coupon usage by customers.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const couponRedemptionsSchema = new mongoose.Schema(
  {
    coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", default: null },
    redeemed_at: { type: Date, required: true, default: Date.now },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

couponRedemptionsSchema.index({ coupon_id: 1 });
couponRedemptionsSchema.index({ customer_id: 1 });
couponRedemptionsSchema.index({ subscription_id: 1 });

module.exports = mongoose.model("CouponRedemption", couponRedemptionsSchema);
