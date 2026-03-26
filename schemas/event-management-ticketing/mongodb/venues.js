// venues: Physical, virtual, or hybrid locations where events take place.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const venuesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    type: {
      type: String,
      enum: ["physical", "virtual", "hybrid"],
      required: true,
      default: "physical",
    },
    address_line1: { type: String, default: null },
    address_line2: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    postal_code: { type: String, default: null },
    country: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    virtual_url: { type: String, default: null },
    virtual_platform: { type: String, default: null },
    capacity: { type: Number, default: null },
    timezone: { type: String, required: true },
    phone: { type: String, default: null },
    email: { type: String, default: null },
    website_url: { type: String, default: null },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

venuesSchema.index({ type: 1 });
venuesSchema.index({ city: 1, state: 1 });
venuesSchema.index({ is_active: 1 });
venuesSchema.index({ created_by: 1 });

module.exports = mongoose.model("Venue", venuesSchema);
