// message_mentions: tracks user, channel, and @all mentions within a message.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const messageMentionSchema = new mongoose.Schema(
  {
    message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    mentioned_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    mention_type: {
      type: String,
      enum: ["user", "channel", "all"],
      required: true,
      default: "user",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

// Composite unique constraint; sparse allows multiple docs with null mentioned_user_id
messageMentionSchema.index(
  { message_id: 1, mentioned_user_id: 1, mention_type: 1 },
  { unique: true, sparse: true }
);

// Index on mentioned_user_id for looking up all mentions of a user
messageMentionSchema.index({ mentioned_user_id: 1 });

const MessageMention = mongoose.model("MessageMention", messageMentionSchema);

module.exports = MessageMention;
