// subscriptions: Customer subscription lifecycle and billing periods.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const subscriptionsSchema = new mongoose.Schema(
  {
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    status: {
      type: String,
      enum: ["trialing", "active", "past_due", "paused", "canceled", "expired", "incomplete"],
      required: true,
      default: "incomplete",
    },
    current_period_start: { type: Date, default: null },
    current_period_end: { type: Date, default: null },
    trial_start: { type: Date, default: null },
    trial_end: { type: Date, default: null },
    canceled_at: { type: Date, default: null },
    ended_at: { type: Date, default: null },
    cancel_at_period_end: { type: Boolean, required: true, default: false },
    paused_at: { type: Date, default: null },
    resumes_at: { type: Date, default: null },
    billing_cycle_anchor: { type: Date, default: null },
    coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

subscriptionsSchema.index({ customer_id: 1 });
subscriptionsSchema.index({ status: 1 });
subscriptionsSchema.index({ provider_type: 1, provider_id: 1 });

module.exports = mongoose.model("Subscription", subscriptionsSchema);
