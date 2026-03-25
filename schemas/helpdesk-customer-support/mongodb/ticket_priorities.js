// ticket_priorities: Urgency levels assignable to tickets.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketPrioritiesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    sort_order: { type: Number, required: true, default: 0 },
    color: { type: String, default: null },
    is_default: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ticketPrioritiesSchema.index({ sort_order: 1 });

module.exports = mongoose.model("TicketPriority", ticketPrioritiesSchema);
