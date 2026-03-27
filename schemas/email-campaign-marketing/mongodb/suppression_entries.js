// suppression_entries: Emails blocked from receiving campaigns due to bounces or complaints.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const suppressionEntrySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      enum: ["hard_bounce", "complaint", "manual", "list_unsubscribe"],
      required: true,
    },
    source_campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

suppressionEntrySchema.index({ reason: 1 });

module.exports = mongoose.model("SuppressionEntry", suppressionEntrySchema);
