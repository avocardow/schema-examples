// conversations: Stores direct, group, and channel conversation metadata.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const conversationsSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["direct", "group", "channel"], required: true },
    name: { type: String, default: null },
    description: { type: String, default: null },
    slug: { type: String, unique: true, sparse: true, default: null },
    is_private: { type: Boolean, required: true, default: false },
    is_archived: { type: Boolean, required: true, default: false },
    last_message_at: { type: Date, default: null },
    message_count: { type: Number, required: true, default: 0 },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

conversationsSchema.index({ type: 1 });
conversationsSchema.index({ is_private: 1, type: 1 });
conversationsSchema.index({ created_by: 1 });
conversationsSchema.index({ last_message_at: 1 });

module.exports = mongoose.model("Conversation", conversationsSchema);
