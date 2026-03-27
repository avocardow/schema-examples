// reward_redemptions: Records of members redeeming points for rewards with fulfillment lifecycle.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const rewardRedemptionSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyMember",
      required: true,
    },
    reward_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },
    points_spent: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "fulfilled", "canceled", "expired"],
      required: true,
      default: "pending",
    },
    coupon_code: { type: String, default: null },
    fulfilled_at: { type: Date, default: null },
    canceled_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

rewardRedemptionSchema.index({ member_id: 1, created_at: 1 });
rewardRedemptionSchema.index({ reward_id: 1 });
rewardRedemptionSchema.index({ status: 1 });

module.exports = mongoose.model("RewardRedemption", rewardRedemptionSchema);
