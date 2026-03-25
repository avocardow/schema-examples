// ticket_activities: Append-only audit trail of ticket changes for accountability and SLA debugging.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketActivitiesSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    action: {
      type: String,
      enum: [
        "created",
        "updated",
        "status_changed",
        "priority_changed",
        "assigned",
        "escalated",
        "reopened",
        "resolved",
        "closed",
        "sla_breached",
      ],
      required: true,
    },
    field: { type: String, default: null },
    old_value: { type: String, default: null },
    new_value: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ticketActivitiesSchema.index({ ticket_id: 1, created_at: 1 });
ticketActivitiesSchema.index({ user_id: 1 });

module.exports = mongoose.model("TicketActivity", ticketActivitiesSchema);
