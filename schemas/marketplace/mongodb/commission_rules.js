// commission_rules: Configurable commission rules by scope, vendor, or category.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const commissionRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    scope: {
      type: String,
      enum: ["global", "vendor", "category"],
      required: true,
    },
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    rate_type: {
      type: String,
      enum: ["percentage", "flat", "hybrid"],
      required: true,
      default: "percentage",
    },
    percentage_rate: { type: Number, default: null },
    flat_rate: { type: Number, default: null },
    currency: { type: String, default: null },
    min_commission: { type: Number, default: null },
    max_commission: { type: Number, default: null },
    is_active: { type: Boolean, required: true, default: true },
    priority: { type: Number, required: true, default: 0 },
    effective_from: { type: Date, default: null },
    effective_to: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

commissionRuleSchema.index({ scope: 1, is_active: 1 });
commissionRuleSchema.index({ vendor_id: 1 });
commissionRuleSchema.index({ category_id: 1 });

module.exports = mongoose.model("CommissionRule", commissionRuleSchema);
