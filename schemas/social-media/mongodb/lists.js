// lists: Stores user-curated lists for organizing followed accounts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const listsSchema = new mongoose.Schema(
  {
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    is_private: { type: Boolean, required: true, default: true },
    member_count: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

listsSchema.index({ owner_id: 1 });

module.exports = mongoose.model("List", listsSchema);
