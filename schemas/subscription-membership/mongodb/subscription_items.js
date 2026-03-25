// subscription_items: Line items linking a subscription to plan prices.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const subscriptionItemsSchema = new mongoose.Schema(
  {
    subscription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: true },
    plan_price_id: { type: mongoose.Schema.Types.ObjectId, ref: "PlanPrice", required: true },
    quantity: { type: Number, required: true, default: 1 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
    provider_type: { type: String, default: null },
    provider_id: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

subscriptionItemsSchema.index({ subscription_id: 1, plan_price_id: 1 }, { unique: true });
subscriptionItemsSchema.index({ plan_price_id: 1 });

module.exports = mongoose.model("SubscriptionItem", subscriptionItemsSchema);
