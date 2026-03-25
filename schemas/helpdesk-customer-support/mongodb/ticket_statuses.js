// ticket_statuses: Workflow states a ticket can occupy.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketStatusesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    sort_order: { type: Number, required: true, default: 0 },
    color: { type: String, default: null },
    is_closed: { type: Boolean, required: true, default: false },
    is_default: { type: Boolean, required: true, default: false },
    description: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ticketStatusesSchema.index({ sort_order: 1 });

module.exports = mongoose.model("TicketStatus", ticketStatusesSchema);
