// comment_votes: User upvotes and downvotes on comments.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const commentVotesSchema = new mongoose.Schema(
  {
    comment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
commentVotesSchema.index({ comment_id: 1, user_id: 1 }, { unique: true });
commentVotesSchema.index({ user_id: 1 });
module.exports = mongoose.model("CommentVote", commentVotesSchema);
