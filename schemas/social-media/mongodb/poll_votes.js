// poll_votes: Records individual user votes on poll options.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pollVotesSchema = new mongoose.Schema(
  {
    poll_id: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    option_index: { type: Number, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

pollVotesSchema.index({ poll_id: 1, user_id: 1, option_index: 1 }, { unique: true });
pollVotesSchema.index({ user_id: 1 });

module.exports = mongoose.model("PollVote", pollVotesSchema);
