// collections: User-curated groups of recipes.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: null },
    cover_image_url: { type: String, default: null },
    is_public: { type: Boolean, required: true, default: false },
    recipe_count: { type: Number, required: true, default: 0 },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

collectionSchema.index({ created_by: 1 });

module.exports = mongoose.model("Collection", collectionSchema);
