// reactions: Stores typed reactions (like, love, etc.) on posts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const reactionsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "love", "celebrate", "insightful", "funny"], required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

reactionsSchema.index({ post_id: 1, user_id: 1, type: 1 }, { unique: true });
reactionsSchema.index({ user_id: 1 });

module.exports = mongoose.model("Reaction", reactionsSchema);
