// wishlists: Named, optionally public wish lists that let users bookmark products for later.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const wishlistsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, default: "Default" },
    is_public: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

wishlistsSchema.index({ user_id: 1 });

module.exports = mongoose.model("Wishlist", wishlistsSchema);
