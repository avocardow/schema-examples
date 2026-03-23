// blocks: Stores user-to-user block relationships.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const blocksSchema = new mongoose.Schema(
  {
    blocker_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    blocked_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

blocksSchema.index({ blocker_id: 1, blocked_id: 1 }, { unique: true });
blocksSchema.index({ blocked_id: 1 });

module.exports = mongoose.model("Block", blocksSchema);
