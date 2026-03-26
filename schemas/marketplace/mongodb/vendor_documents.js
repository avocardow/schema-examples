// vendor_documents: Uploaded verification documents for vendor onboarding.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorDocumentSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    type: {
      type: String,
      enum: ["business_license", "tax_certificate", "identity_proof", "bank_statement", "other"],
      required: true,
    },
    file_url: { type: String, required: true },
    file_name: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
    rejection_reason: { type: String, default: null },
    reviewed_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewed_at: { type: Date, default: null },
    expires_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

vendorDocumentSchema.index({ vendor_id: 1, type: 1 });
vendorDocumentSchema.index({ status: 1 });

module.exports = mongoose.model("VendorDocument", vendorDocumentSchema);
