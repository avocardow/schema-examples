// tickets: Individual issued tickets tied to an order item and holder.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema(
  {
    order_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "OrderItem", required: true },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    ticket_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketType", default: null },
    holder_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    holder_name: { type: String, required: true },
    holder_email: { type: String, required: true },
    ticket_code: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["valid", "used", "cancelled", "transferred", "expired"],
      required: true,
      default: "valid",
    },
    checked_in_at: { type: Date, default: null },
    cancelled_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ticketsSchema.index({ event_id: 1, status: 1 });
ticketsSchema.index({ holder_user_id: 1 });
ticketsSchema.index({ holder_email: 1 });
ticketsSchema.index({ order_item_id: 1 });

module.exports = mongoose.model("Ticket", ticketsSchema);
