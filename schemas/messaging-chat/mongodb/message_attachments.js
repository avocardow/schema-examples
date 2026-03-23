// message_attachments: files attached to a chat message, linking messages to stored files.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const messageAttachmentSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    file_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    file_size: {
      type: Number,
      required: true,
    },
    mime_type: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

messageAttachmentSchema.index({ message_id: 1 });
messageAttachmentSchema.index({ file_id: 1 });

module.exports = mongoose.model("MessageAttachment", messageAttachmentSchema);
