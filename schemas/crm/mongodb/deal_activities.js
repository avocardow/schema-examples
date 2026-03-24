// deal_activities: Append-only audit trail of deal changes for pipeline analytics.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const dealActivitiesSchema = new mongoose.Schema(
  {
    deal_id: { type: mongoose.Schema.Types.ObjectId, ref: "Deal", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    action: {
      type: String,
      enum: ["created", "updated", "stage_changed", "won", "lost", "reopened"],
      required: true,
    },
    field: { type: String, default: null },
    old_value: { type: String, default: null },
    new_value: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

dealActivitiesSchema.index({ deal_id: 1, created_at: 1 });
dealActivitiesSchema.index({ user_id: 1 });

module.exports = mongoose.model("DealActivity", dealActivitiesSchema);
