// addresses: User-associated shipping and billing addresses with default flags.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const addressesSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, default: null },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    company: { type: String, default: null },
    address_line1: { type: String, required: true },
    address_line2: { type: String, default: null },
    city: { type: String, required: true },
    region: { type: String, default: null },
    postal_code: { type: String, default: null },
    country: { type: String, required: true },
    phone: { type: String, default: null },
    is_default_shipping: { type: Boolean, required: true, default: false },
    is_default_billing: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

addressesSchema.index({ user_id: 1 });

module.exports = mongoose.model("Address", addressesSchema);
