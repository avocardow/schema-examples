// conversation_participants: tracks which users belong to a conversation, their role, and read/notification state.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const conversationParticipantSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "moderator", "member"],
      required: true,
      default: "member",
    },
    last_read_at: {
      type: Date,
      default: null,
    },
    notification_level: {
      type: String,
      enum: ["all", "mentions", "none"],
      default: null,
    },
    is_muted: {
      type: Boolean,
      required: true,
      default: false,
    },
    muted_until: {
      type: Date,
      default: null,
    },
    joined_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

conversationParticipantSchema.index({ conversation_id: 1, user_id: 1 }, { unique: true });
conversationParticipantSchema.index({ user_id: 1, last_read_at: 1 });

const ConversationParticipant = mongoose.model(
  "ConversationParticipant",
  conversationParticipantSchema
);

module.exports = ConversationParticipant;
