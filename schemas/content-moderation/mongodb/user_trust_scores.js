// user_trust_scores: User reputation tracking in the moderation system.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const userTrustScoresSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    // new = new account, highest scrutiny.
    // basic = verified email, some activity.
    // member = established user, good standing.
    // trusted = long history of compliance.
    // veteran = exemplary record, may assist in moderation.
    trust_level: {
      type: String,
      enum: ["new", "basic", "member", "trusted", "veteran"],
      required: true,
      default: "new",
    },

    trust_score: { type: Number, required: true, default: 0.5 }, // Continuous score from 0.00 (lowest) to 1.00 (highest).
    total_reports_filed: { type: Number, required: true, default: 0 },
    reports_upheld: { type: Number, required: true, default: 0 }, // Reports that led to enforcement action.
    reports_dismissed: { type: Number, required: true, default: 0 },
    flag_accuracy: { type: Number, required: true, default: 0.5 }, // reports_upheld / total_reports_filed (cached).
    content_violations: { type: Number, required: true, default: 0 },
    last_violation_at: { type: Date, default: null }, // When the user's most recent violation occurred.
  },
  {
    timestamps: { createdAt: false, updatedAt: "updated_at" },
  }
);

// Indexes
userTrustScoresSchema.index({ trust_level: 1 });
userTrustScoresSchema.index({ trust_score: 1 });

module.exports = mongoose.model("UserTrustScore", userTrustScoresSchema);
