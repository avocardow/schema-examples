// vendor_addresses: Physical addresses associated with vendors.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorAddressSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    type: {
      type: String,
      enum: ["business", "warehouse", "return"],
      required: true,
    },
    label: { type: String, default: null },
    address_line1: { type: String, required: true },
    address_line2: { type: String, default: null },
    city: { type: String, required: true },
    region: { type: String, default: null },
    postal_code: { type: String, default: null },
    country: { type: String, required: true },
    phone: { type: String, default: null },
    is_default: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

vendorAddressSchema.index({ vendor_id: 1, type: 1 });

module.exports = mongoose.model("VendorAddress", vendorAddressSchema);
