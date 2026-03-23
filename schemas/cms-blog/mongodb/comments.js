// comments: Threaded user comments on posts with moderation status.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const commentsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    author_name: { type: String, required: true },
    author_email: { type: String, default: null },
    content: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "spam"], required: true, default: "pending" },
    ip_address: { type: String, default: null },
    user_agent: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
commentsSchema.index({ post_id: 1, status: 1, created_at: 1 });
commentsSchema.index({ parent_id: 1 });
commentsSchema.index({ author_id: 1 });
module.exports = mongoose.model("Comment", commentsSchema);
