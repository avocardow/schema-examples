// ticket_feedback: Customer satisfaction ratings submitted after ticket resolution.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketFeedbackSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", unique: true, required: true },
    rating: {
      type: String,
      enum: ["good", "bad"],
      required: true,
    },
    comment: { type: String, default: null },
    created_by_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ticketFeedbackSchema.index({ rating: 1 });
ticketFeedbackSchema.index({ created_by_id: 1 });

module.exports = mongoose.model("TicketFeedback", ticketFeedbackSchema);
