// vendor_reviews: Customer ratings and reviews for vendors.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const vendorReviewSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor_order_id: { type: mongoose.Schema.Types.ObjectId, ref: "VendorOrder", default: null },
    rating: { type: Number, required: true },
    title: { type: String, default: null },
    body: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
      default: "pending",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

vendorReviewSchema.index({ vendor_id: 1, status: 1 });
vendorReviewSchema.index(
  { vendor_id: 1, customer_id: 1, vendor_order_id: 1 },
  { unique: true, sparse: true }
);
vendorReviewSchema.index({ status: 1 });

module.exports = mongoose.model("VendorReview", vendorReviewSchema);
