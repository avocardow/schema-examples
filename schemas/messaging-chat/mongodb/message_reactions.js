// message_reactions: stores per-user emoji reactions to messages, with a composite unique constraint preventing duplicate reactions.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const messageReactionSchema = new mongoose.Schema(
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
    emoji: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

messageReactionSchema.index({ message_id: 1, user_id: 1, emoji: 1 }, { unique: true });
messageReactionSchema.index({ user_id: 1 });

const MessageReaction = mongoose.model("MessageReaction", messageReactionSchema);

module.exports = MessageReaction;
