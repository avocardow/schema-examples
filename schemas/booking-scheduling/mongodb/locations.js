// locations: Physical and virtual venues where services are offered.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const locationsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    type: { type: String, enum: ["physical", "virtual"], required: true, default: "physical" },
    description: { type: String, default: null },
    address_line1: { type: String, default: null },
    address_line2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    postal_code: { type: String, default: null },
    country: { type: String, default: null },
    virtual_url: { type: String, default: null },
    timezone: { type: String, required: true },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    position: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

locationsSchema.index({ type: 1 });
locationsSchema.index({ is_active: 1, position: 1 });

module.exports = mongoose.model("Location", locationsSchema);
