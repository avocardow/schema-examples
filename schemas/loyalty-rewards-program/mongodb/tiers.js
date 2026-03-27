// tiers: Tier/VIP level definitions with qualification thresholds and ordering.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const tierSchema = new mongoose.Schema(
  {
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyProgram",
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: null },
    position: { type: Number, required: true },
    qualification_type: {
      type: String,
      enum: ["points_earned", "amount_spent", "transaction_count"],
      required: true,
      default: "points_earned",
    },
    qualification_value: { type: Number, required: true },
    qualification_period_days: { type: Number, default: null },
    retain_days: { type: Number, default: null },
    icon_url: { type: String, default: null },
    color: { type: String, default: null },
    is_default: { type: Boolean, required: true, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

tierSchema.index({ program_id: 1, slug: 1 }, { unique: true });
tierSchema.index({ program_id: 1, position: 1 }, { unique: true });
tierSchema.index({ is_default: 1 });

module.exports = mongoose.model("Tier", tierSchema);
