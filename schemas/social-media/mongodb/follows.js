// follows: Tracks follower-following relationships between users.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const followsSchema = new mongoose.Schema(
  {
    follower_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    following_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notify: { type: Boolean, required: true, default: false },
    show_reposts: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

followsSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });
followsSchema.index({ following_id: 1 });

module.exports = mongoose.model("Follow", followsSchema);
