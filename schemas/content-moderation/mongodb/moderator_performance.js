// moderator_performance: Pre-aggregated moderator performance metrics.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const moderatorPerformanceSchema = new mongoose.Schema(
  {
    moderator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    period_start: { type: Date, required: true },
    period_end: { type: Date, required: true },
    items_reviewed: { type: Number, required: true, default: 0 },
    items_actioned: { type: Number, required: true, default: 0 }, // Items where enforcement action was taken (vs approved/dismissed).
    average_review_time_seconds: { type: Number, required: true, default: 0 }, // Mean time from assignment to resolution, in seconds.
    appeals_overturned: { type: Number, required: true, default: 0 }, // Actions by this moderator that were overturned on appeal.
    accuracy_score: { type: Number, required: true, default: 1.0 }, // 1.0 - (appeals_overturned / items_actioned), clamped to 0-1.
    computed_at: { type: Date, required: true, default: Date.now }, // When this rollup was last computed.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Indexes
moderatorPerformanceSchema.index(
  { moderator_id: 1, period_start: 1, period_end: 1 },
  { unique: true }
);
moderatorPerformanceSchema.index({ period_start: 1, period_end: 1 });

module.exports = mongoose.model("ModeratorPerformance", moderatorPerformanceSchema);
