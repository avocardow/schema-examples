// mutes: Stores user-to-user mute relationships with optional expiration.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const mutesSchema = new mongoose.Schema(
  {
    muter_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    muted_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expires_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

mutesSchema.index({ muter_id: 1, muted_id: 1 }, { unique: true });
mutesSchema.index({ muted_id: 1 });
mutesSchema.index({ expires_at: 1 });

module.exports = mongoose.model("Mute", mutesSchema);
