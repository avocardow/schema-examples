// post_reactions: Emoji-style reactions on posts by authenticated users.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const postReactionsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reaction_type: { type: String, enum: ["like", "love", "clap", "insightful", "bookmark"], required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);
postReactionsSchema.index({ post_id: 1, user_id: 1, reaction_type: 1 }, { unique: true });
postReactionsSchema.index({ user_id: 1 });
postReactionsSchema.index({ post_id: 1, reaction_type: 1 });
module.exports = mongoose.model("PostReaction", postReactionsSchema);
