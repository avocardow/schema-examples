// loyalty_members: Enrollment of a user in a loyalty program with cached point balances.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const loyaltyMemberSchema = new mongoose.Schema(
  {
    program_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyProgram",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    member_number: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      required: true,
      default: "active",
    },
    points_balance: { type: Number, required: true, default: 0 },
    points_pending: { type: Number, required: true, default: 0 },
    lifetime_points: { type: Number, required: true, default: 0 },
    points_redeemed: { type: Number, required: true, default: 0 },
    points_expired: { type: Number, required: true, default: 0 },
    enrolled_at: { type: Date, required: true, default: Date.now },
    suspended_at: { type: Date, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

loyaltyMemberSchema.index({ program_id: 1, user_id: 1 }, { unique: true });
loyaltyMemberSchema.index({ user_id: 1 });
loyaltyMemberSchema.index({ status: 1 });
loyaltyMemberSchema.index({ points_balance: 1 });

module.exports = mongoose.model("LoyaltyMember", loyaltyMemberSchema);
