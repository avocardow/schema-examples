// plan_prices: Pricing tiers for a plan.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const planPricesSchema = new mongoose.Schema(
  {
    plan_id: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    nickname: { type: String, default: null },
    type: {
      type: String,
      enum: ["recurring", "one_time", "usage_based"],
      required: true,
      default: "recurring",
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    interval: {
      type: String,
      enum: ["day", "week", "month", "year"],
      default: null,
    },
    interval_count: { type: Number, required: true, default: 1 },
    trial_period_days: { type: Number, default: null },
    is_active: { type: Boolean, required: true, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

planPricesSchema.index({ plan_id: 1 });
planPricesSchema.index({ is_active: 1 });
planPricesSchema.index({ provider_type: 1, provider_id: 1 });

module.exports = mongoose.model("PlanPrice", planPricesSchema);
