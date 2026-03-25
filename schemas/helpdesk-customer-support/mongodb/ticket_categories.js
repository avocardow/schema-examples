// ticket_categories: Hierarchical groupings for organizing tickets by topic.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const ticketCategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "TicketCategory", default: null },
    sort_order: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ticketCategoriesSchema.index({ parent_id: 1, sort_order: 1 });

module.exports = mongoose.model("TicketCategory", ticketCategoriesSchema);
