// loyalty_programs: Top-level loyalty program configuration with currency, earning, and expiration settings.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const loyaltyProgramSchema = new mongoose.Schema(
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
    currency_name: { type: String, required: true, default: "points" },
    points_per_currency: { type: Number, required: true, default: 1 },
    currency: { type: String, default: null },
    points_expiry_days: { type: Number, default: null },
    allow_negative: { type: Boolean, required: true, default: false },
    is_public: { type: Boolean, required: true, default: true },
    terms_url: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

loyaltyProgramSchema.index({ status: 1 });
loyaltyProgramSchema.index({ created_by: 1 });

module.exports = mongoose.model("LoyaltyProgram", loyaltyProgramSchema);
