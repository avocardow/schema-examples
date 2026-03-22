// discounts: Discount codes and rules for percentage, fixed-amount, or free-shipping promotions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const discountsSchema = new mongoose.Schema(
  {
    code: { type: String, default: null },
    type: { type: String, enum: ["percentage", "fixed_amount", "free_shipping"], required: true },
    value: { type: Number, required: true },
    currency: { type: String, default: null },
    conditions: { type: mongoose.Schema.Types.Mixed, default: null },
    usage_limit: { type: Number, default: null },
    usage_count: { type: Number, required: true, default: 0 },
    per_customer_limit: { type: Number, default: null },
    starts_at: { type: Date, default: null },
    ends_at: { type: Date, default: null },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

discountsSchema.index({ code: 1 }, { unique: true, sparse: true });
discountsSchema.index({ type: 1 });
discountsSchema.index({ is_active: 1, starts_at: 1, ends_at: 1 });

module.exports = mongoose.model("Discount", discountsSchema);
