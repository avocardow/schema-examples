// event_categories: Hierarchical classification of events.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventCategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventCategory", default: null },
    position: { type: Number, required: true, default: 0 },
    color: { type: String, default: null },
    icon: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

eventCategoriesSchema.index({ parent_id: 1 });
eventCategoriesSchema.index({ is_active: 1, position: 1 });

module.exports = mongoose.model("EventCategory", eventCategoriesSchema);
