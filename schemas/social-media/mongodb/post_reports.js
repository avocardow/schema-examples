// post_reports: Stores user-submitted reports on posts for moderation review.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const postReportsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    reporter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, enum: ["spam", "harassment", "hate_speech", "violence", "misinformation", "nsfw", "other"], required: true },
    description: { type: String, default: null },
    status: { type: String, enum: ["pending", "reviewed", "resolved", "dismissed"], required: true, default: "pending" },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

postReportsSchema.index({ post_id: 1, reporter_id: 1 }, { unique: true });
postReportsSchema.index({ status: 1 });
postReportsSchema.index({ reporter_id: 1 });
postReportsSchema.index({ reviewed_by: 1 });

module.exports = mongoose.model("PostReport", postReportsSchema);
