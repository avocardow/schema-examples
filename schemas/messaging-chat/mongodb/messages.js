// messages: Stores individual messages within conversations, supporting threading, edits, and expiry.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    content: { type: String, default: null },
    content_type: { type: String, enum: ["text", "system", "deleted"], required: true, default: "text" },
    parent_message_id: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    reply_count: { type: Number, required: true, default: 0 },
    last_reply_at: { type: Date, default: null },
    is_edited: { type: Boolean, required: true, default: false },
    edited_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

messagesSchema.index({ conversation_id: 1, created_at: 1 });
messagesSchema.index({ sender_id: 1 });
messagesSchema.index({ parent_message_id: 1 });
messagesSchema.index({ conversation_id: 1, parent_message_id: 1 });
messagesSchema.index({ expires_at: 1 });

module.exports = mongoose.model("Message", messagesSchema);
