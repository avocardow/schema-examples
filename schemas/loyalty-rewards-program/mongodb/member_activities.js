// member_activities: Log of member actions that may trigger earning rules.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const memberActivitySchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoyaltyMember",
      required: true,
    },
    activity_type: { type: String, required: true },
    description: { type: String, default: null },
    source: { type: String, default: null },
    reference_type: { type: String, default: null },
    reference_id: { type: String, default: null },
    monetary_value: { type: Number, default: null },
    currency: { type: String, default: null },
    points_awarded: { type: Number, default: null },
    transaction_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PointsTransaction",
      default: null,
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

memberActivitySchema.index({ member_id: 1, created_at: 1 });
memberActivitySchema.index({ activity_type: 1 });
memberActivitySchema.index({ reference_type: 1, reference_id: 1 });
memberActivitySchema.index({ transaction_id: 1 });

module.exports = mongoose.model("MemberActivity", memberActivitySchema);
