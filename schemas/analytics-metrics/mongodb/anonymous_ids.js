// anonymous_ids: Maps anonymous visitor identifiers to authenticated user accounts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const anonymousIdsSchema = new mongoose.Schema(
  {
    anonymous_id: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    first_seen_at: { type: Date, required: true },
    identified_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

anonymousIdsSchema.index({ anonymous_id: 1, user_id: 1 }, { unique: true });
anonymousIdsSchema.index({ user_id: 1 });

module.exports = mongoose.model("AnonymousId", anonymousIdsSchema);
