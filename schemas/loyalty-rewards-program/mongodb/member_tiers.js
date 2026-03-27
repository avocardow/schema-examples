// member_tiers: Assignment of members to tiers with temporal tracking and history.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const memberTierSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyMember",
      required: true,
    },
    tier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tier",
      required: true,
    },
    is_current: { type: Boolean, required: true, default: true },
    started_at: { type: Date, required: true, default: Date.now },
    ends_at: { type: Date, default: null },
    ended_at: { type: Date, default: null },
    qualification_snapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    is_manual: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

memberTierSchema.index({ member_id: 1, is_current: 1 });
memberTierSchema.index({ tier_id: 1 });
memberTierSchema.index({ ends_at: 1 });

module.exports = mongoose.model("MemberTier", memberTierSchema);
