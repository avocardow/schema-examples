// items: Auction items listed by sellers with condition and category classification.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    title: { type: String, required: true },
    description: { type: String, default: null },
    condition: {
      type: String,
      enum: ["new", "like_new", "excellent", "good", "fair", "poor"],
      required: true,
      default: "new",
    },
    condition_notes: { type: String, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

itemSchema.index({ seller_id: 1 });
itemSchema.index({ category_id: 1 });
itemSchema.index({ condition: 1 });

module.exports = mongoose.model("Item", itemSchema);
