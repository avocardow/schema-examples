// ticket_attachments: Files attached to ticket messages with metadata.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketAttachmentsSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    message_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketMessage", default: null },
    file_name: { type: String, required: true },
    file_url: { type: String, required: true },
    file_size: { type: Number, default: null },
    mime_type: { type: String, default: null },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ticketAttachmentsSchema.index({ ticket_id: 1 });
ticketAttachmentsSchema.index({ message_id: 1 });

module.exports = mongoose.model("TicketAttachment", ticketAttachmentsSchema);
