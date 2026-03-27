// rewards: Catalog of available rewards with points cost and inventory tracking.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyProgram",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: null },
    reward_type: {
      type: String,
      enum: [
        "discount_percentage",
        "discount_fixed",
        "free_product",
        "free_shipping",
        "gift_card",
        "experience",
        "custom",
      ],
      required: true,
    },
    points_cost: { type: Number, required: true },
    reward_value: { type: Number, default: null },
    currency: { type: String, default: null },
    image_url: { type: String, default: null },
    inventory: { type: Number, default: null },
    max_redemptions_per_member: { type: Number, default: null },
    is_active: { type: Boolean, required: true, default: true },
    min_tier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
      default: null,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    sort_order: { type: Number, required: true, default: 0 },
    valid_from: { type: Date, default: null },
    valid_until: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

rewardSchema.index({ program_id: 1, is_active: 1 });
rewardSchema.index({ reward_type: 1 });
rewardSchema.index({ min_tier_id: 1 });

module.exports = mongoose.model("Reward", rewardSchema);
