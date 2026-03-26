// listings: Vendor product listings with approval workflow.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    status: {
      type: String,
      enum: ["draft", "pending_approval", "active", "paused", "rejected", "archived"],
      required: true,
      default: "draft",
    },
    condition: {
      type: String,
      enum: ["new", "refurbished", "used_like_new", "used_good", "used_fair"],
      required: true,
      default: "new",
    },
    handling_days: { type: Number, required: true, default: 1 },
    rejection_reason: { type: String, default: null },
    approved_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

listingSchema.index({ vendor_id: 1, product_id: 1 }, { unique: true });
listingSchema.index({ product_id: 1, status: 1 });
listingSchema.index({ status: 1 });

module.exports = mongoose.model("Listing", listingSchema);
