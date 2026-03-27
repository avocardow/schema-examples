// promotions: Time-limited bonus earning campaigns (multipliers, fixed bonuses).
// See README.md for full design rationale.
const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyProgram",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: null },
    promotion_type: {
      type: String,
      enum: ["multiplier", "fixed_bonus"],
      required: true,
      default: "multiplier",
    },
    multiplier: { type: Number, default: null },
    bonus_points: { type: Number, default: null },
    event_type: { type: String, default: null },
    conditions: { type: mongoose.Schema.Types.Mixed, default: null },
    status: {
      type: String,
      enum: ["scheduled", "active", "ended", "canceled"],
      required: true,
      default: "scheduled",
    },
    starts_at: { type: Date, required: true },
    ends_at: { type: Date, required: true },
    max_points_per_member: { type: Number, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

promotionSchema.index({ program_id: 1, status: 1 });
promotionSchema.index({ status: 1 });
promotionSchema.index({ starts_at: 1, ends_at: 1 });

module.exports = mongoose.model("Promotion", promotionSchema);
