// ticket_tags: Many-to-many associations between tickets and tags.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketTagsSchema = new mongoose.Schema(
  {
    ticket_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    tag_id: { type: mongoose.Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

ticketTagsSchema.index({ ticket_id: 1, tag_id: 1 }, { unique: true });
ticketTagsSchema.index({ tag_id: 1 });

module.exports = mongoose.model("TicketTag", ticketTagsSchema);
