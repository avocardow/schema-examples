// service_addons: Optional add-on services that extend a primary service.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const serviceAddonsSchema = new mongoose.Schema(
  {
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    name: { type: String, required: true },
    description: { type: String, default: null },
    duration: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    currency: { type: String, default: null },
    position: { type: Number, required: true, default: 0 },
    is_active: { type: Boolean, required: true, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

serviceAddonsSchema.index({ service_id: 1, position: 1 });
serviceAddonsSchema.index({ is_active: 1 });

module.exports = mongoose.model("ServiceAddon", serviceAddonsSchema);
