// event_types: Catalog of trackable event types with optional validation schemas.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventTypesSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    category: { type: String, default: null },
    display_name: { type: String, required: true },
    description: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    schema: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

eventTypesSchema.index({ category: 1 });
eventTypesSchema.index({ is_active: 1 });

module.exports = mongoose.model("EventType", eventTypesSchema);
