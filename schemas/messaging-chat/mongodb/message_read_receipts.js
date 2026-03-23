// message_read_receipts: tracks per-user delivery and read status for each message.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const messageReadReceiptSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    delivered_at: { type: Date, default: null },
    read_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

messageReadReceiptSchema.index({ message_id: 1, user_id: 1 }, { unique: true });
messageReadReceiptSchema.index({ user_id: 1, read_at: 1 });

const MessageReadReceipt = mongoose.model(
  "MessageReadReceipt",
  messageReadReceiptSchema
);

module.exports = MessageReadReceipt;
