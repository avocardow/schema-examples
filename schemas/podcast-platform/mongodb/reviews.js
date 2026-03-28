// reviews: User reviews and ratings for podcast shows.
// See README.md for full design rationale.
const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show_id: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    rating: { type: Number, required: true },
    title: { type: String, default: null },
    body: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

reviewsSchema.index({ user_id: 1, show_id: 1 }, { unique: true });
reviewsSchema.index({ show_id: 1, created_at: 1 });
reviewsSchema.index({ show_id: 1, rating: 1 });

module.exports = mongoose.model("Review", reviewsSchema);
