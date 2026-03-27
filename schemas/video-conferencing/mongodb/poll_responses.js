// poll_responses: Individual user responses to meeting polls.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pollResponsesSchema = new mongoose.Schema(
  {
    poll_id: { type: mongoose.Schema.Types.ObjectId, ref: "MeetingPoll", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    selected_options: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

pollResponsesSchema.index({ poll_id: 1, user_id: 1 }, { unique: true });
pollResponsesSchema.index({ user_id: 1 });

module.exports = mongoose.model("PollResponse", pollResponsesSchema);
