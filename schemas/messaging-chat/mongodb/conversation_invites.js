// conversation_invites: tracks invitations sent to users to join a conversation, including status lifecycle and optional expiry.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const conversationInviteSchema = new mongoose.Schema(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    inviter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invitee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      required: true,
      default: "pending",
    },
    message: {
      type: String,
      default: null,
    },
    expires_at: {
      type: Date,
      default: null,
    },
    responded_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Composite unique: one active invite per invitee per conversation per status
conversationInviteSchema.index(
  { conversation_id: 1, invitee_id: 1, status: 1 },
  { unique: true }
);

// invitee_id is the leading field here, so no separate single-field index needed
conversationInviteSchema.index({ invitee_id: 1, status: 1 });

// conversation_id is the leading field here, so no separate single-field index needed
conversationInviteSchema.index({ conversation_id: 1, status: 1 });

conversationInviteSchema.index({ expires_at: 1 });

const ConversationInvite = mongoose.model(
  "ConversationInvite",
  conversationInviteSchema
);

module.exports = ConversationInvite;
