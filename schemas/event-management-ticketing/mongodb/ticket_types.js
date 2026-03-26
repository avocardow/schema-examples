// ticket_types: Purchasable ticket tiers for an event.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketTypesSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    quantity_total: { type: Number, default: null },
    quantity_sold: { type: Number, required: true, default: 0 },
    min_per_order: { type: Number, required: true, default: 1 },
    max_per_order: { type: Number, required: true, default: 10 },
    sale_start_at: { type: Date, default: null },
    sale_end_at: { type: Date, default: null },
    is_active: { type: Boolean, required: true, default: true },
    is_hidden: { type: Boolean, required: true, default: false },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ticketTypesSchema.index({ event_id: 1, position: 1 });
ticketTypesSchema.index({ event_id: 1, is_active: 1 });

module.exports = mongoose.model("TicketType", ticketTypesSchema);
