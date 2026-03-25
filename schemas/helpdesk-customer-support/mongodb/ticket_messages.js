// ticket_messages: Replies, notes, and system messages within a ticket thread.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketMessagesSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    type: {
      type: String,
      enum: ["reply", "note", "customer_message", "system"],
      required: true,
    },
    body: { type: String, required: true },
    is_private: { type: Boolean, required: true, default: false },
    channel: {
      type: String,
      enum: ["email", "web", "api", "system"],
      required: true,
      default: "web",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ticketMessagesSchema.index({ ticket_id: 1, created_at: 1 });
ticketMessagesSchema.index({ sender_id: 1 });

module.exports = mongoose.model("TicketMessage", ticketMessagesSchema);
