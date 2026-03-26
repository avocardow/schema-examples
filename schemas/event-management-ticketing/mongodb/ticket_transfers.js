// ticket_transfers: Audit trail of ticket ownership changes between holders.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketTransfersSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    from_name: { type: String, required: true },
    from_email: { type: String, required: true },
    to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    to_name: { type: String, required: true },
    to_email: { type: String, required: true },
    transferred_at: { type: Date, required: true, default: Date.now },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ticketTransfersSchema.index({ ticket_id: 1 });
ticketTransfersSchema.index({ from_user_id: 1 });
ticketTransfersSchema.index({ to_user_id: 1 });

module.exports = mongoose.model("TicketTransfer", ticketTransfersSchema);
