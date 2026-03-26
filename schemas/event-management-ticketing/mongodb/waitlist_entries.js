// waitlist_entries: Users waiting for ticket availability on sold-out events.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const waitlistEntriesSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    ticket_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketType", default: null },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    email: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["waiting", "notified", "converted", "expired", "cancelled"],
      required: true,
      default: "waiting",
    },
    notified_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

waitlistEntriesSchema.index({ event_id: 1, ticket_type_id: 1, status: 1 });
waitlistEntriesSchema.index({ user_id: 1 });
waitlistEntriesSchema.index({ email: 1, status: 1 });
waitlistEntriesSchema.index({ status: 1, notified_at: 1 });

module.exports = mongoose.model("WaitlistEntry", waitlistEntriesSchema);
