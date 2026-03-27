// tier_benefits: Specific benefits unlocked at each tier (multipliers, perks, access).
// See README.md for full design rationale.
const mongoose = require("mongoose");

const tierBenefitSchema = new mongoose.Schema(
  {
    tier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
      required: true,
    },
    benefit_type: {
      type: String,
      enum: [
        "points_multiplier",
        "free_shipping",
        "early_access",
        "birthday_bonus",
        "exclusive_rewards",
        "priority_support",
        "custom",
      ],
      required: true,
    },
    value: { type: String, default: null },
    description: { type: String, required: true },
    is_active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tierBenefitSchema.index({ tier_id: 1 });
tierBenefitSchema.index({ benefit_type: 1 });

module.exports = mongoose.model("TierBenefit", tierBenefitSchema);
