// vendor_profiles: Extended profile information for vendor storefronts.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorProfileSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, unique: true },
    display_name: { type: String, required: true },
    tagline: { type: String, default: null },
    description: { type: String, default: null },
    logo_url: { type: String, default: null },
    banner_url: { type: String, default: null },
    website_url: { type: String, default: null },
    social_links: { type: mongoose.Schema.Types.Mixed, default: null },
    return_policy: { type: String, default: null },
    shipping_policy: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("VendorProfile", vendorProfileSchema);
