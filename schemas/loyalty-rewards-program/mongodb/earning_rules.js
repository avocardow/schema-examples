// earning_rules: Rules defining how members earn points (event type, amount, conditions).
// See README.md for full design rationale.
const mongoose = require("mongoose");

const earningRuleSchema = new mongoose.Schema(
  {
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyProgram",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: null },
    event_type: { type: String, required: true },
    earning_type: {
      type: String,
      enum: ["fixed", "per_currency", "multiplier"],
      required: true,
      default: "fixed",
    },
    points_amount: { type: Number, default: null },
    multiplier: { type: Number, default: null },
    min_purchase_amount: { type: Number, default: null },
    max_points_per_event: { type: Number, default: null },
    conditions: { type: mongoose.Schema.Types.Mixed, default: null },
    is_active: { type: Boolean, required: true, default: true },
    sort_order: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

earningRuleSchema.index({ program_id: 1, is_active: 1 });
earningRuleSchema.index({ event_type: 1 });

module.exports = mongoose.model("EarningRule", earningRuleSchema);
