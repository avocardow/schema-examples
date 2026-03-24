// services: Defines bookable services with pricing, duration, and scheduling constraints.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", default: null },
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: String, default: null },
    duration: { type: Number, required: true },
    buffer_before: { type: Number, required: true, default: 0 },
    buffer_after: { type: Number, required: true, default: 0 },
    price: { type: Number, default: null },
    currency: { type: String, default: null },
    max_attendees: { type: Number, required: true, default: 1 },
    min_attendees: { type: Number, required: true, default: 1 },
    min_notice: { type: Number, required: true, default: 0 },
    max_advance: { type: Number, required: true, default: 43200 },
    slot_interval: { type: Number, default: null },
    is_active: { type: Boolean, required: true, default: true },
    is_private: { type: Boolean, required: true, default: false },
    color: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

servicesSchema.index({ category_id: 1 });
servicesSchema.index({ is_active: 1, is_private: 1 });
servicesSchema.index({ created_by: 1 });

module.exports = mongoose.model("Service", servicesSchema);
