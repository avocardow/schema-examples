// programs: Affiliate and referral program definitions with commission settings.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "archived"],
      required: true,
      default: "draft",
    },
    commission_type: {
      type: String,
      enum: ["percentage", "flat", "hybrid"],
      required: true,
      default: "percentage",
    },
    commission_percentage: { type: Number, default: null },
    commission_flat: { type: Number, default: null },
    currency: { type: String, required: true },
    cookie_duration: { type: Number, required: true, default: 30 },
    attribution_model: {
      type: String,
      enum: ["first_touch", "last_touch"],
      required: true,
      default: "last_touch",
    },
    min_payout: { type: Number, required: true, default: 0 },
    auto_approve: { type: Boolean, required: true, default: false },
    is_public: { type: Boolean, required: true, default: true },
    terms_url: { type: String, default: null },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

programSchema.index({ status: 1 });
programSchema.index({ created_by: 1 });

module.exports = mongoose.model("Program", programSchema);
