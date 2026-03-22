// product_reviews: Stores customer ratings and written feedback for products, with moderation status.
// See README.md for full design rationale.
const mongoose = require("mongoose");
const productReviewsSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
    title: { type: String, default: null },
    body: { type: String, default: null },
    status: { type: String, enum: ["pending", "approved", "rejected"], required: true, default: "pending" },
    verified_purchase: { type: Boolean, required: true, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
productReviewsSchema.index({ product_id: 1, user_id: 1 }, { unique: true });
productReviewsSchema.index({ product_id: 1, status: 1 });
productReviewsSchema.index({ status: 1 });
module.exports = mongoose.model("ProductReview", productReviewsSchema);
