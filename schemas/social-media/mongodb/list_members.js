// list_members: Tracks which users belong to which lists.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const listMembersSchema = new mongoose.Schema(
  {
    list_id: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

listMembersSchema.index({ list_id: 1, user_id: 1 }, { unique: true });
listMembersSchema.index({ user_id: 1 });

module.exports = mongoose.model("ListMember", listMembersSchema);
