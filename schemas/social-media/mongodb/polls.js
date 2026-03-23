// polls: Stores poll configurations with options, vote counts, and closing state.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pollsSchema = new mongoose.Schema(
  {
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    allows_multiple: { type: Boolean, required: true, default: false },
    options: { type: mongoose.Schema.Types.Mixed, required: true },
    vote_count: { type: Number, required: true, default: 0 },
    voter_count: { type: Number, required: true, default: 0 },
    closes_at: { type: Date, default: null },
    is_closed: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

pollsSchema.index({ author_id: 1 });
pollsSchema.index({ closes_at: 1 });

module.exports = mongoose.model("Poll", pollsSchema);
