// ticket_followers: Users subscribed to updates on specific tickets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketFollowersSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ticketFollowersSchema.index({ ticket_id: 1, user_id: 1 }, { unique: true });
ticketFollowersSchema.index({ user_id: 1 });

module.exports = mongoose.model("TicketFollower", ticketFollowersSchema);
