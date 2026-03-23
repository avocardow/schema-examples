// mentions: Tracks user mentions within posts for notifications and lookups.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const mentionsSchema = new mongoose.Schema(
  {
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    mentioned_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

mentionsSchema.index({ post_id: 1, mentioned_user_id: 1 }, { unique: true });
mentionsSchema.index({ mentioned_user_id: 1, created_at: 1 });

module.exports = mongoose.model("Mention", mentionsSchema);
