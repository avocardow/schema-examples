// recipes: Core table storing recipe metadata and status.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    source_url: { type: String, default: null },
    source_name: { type: String, default: null },
    servings: { type: String, default: null },
    prep_time_minutes: { type: Number, default: null },
    cook_time_minutes: { type: Number, default: null },
    total_time_minutes: { type: Number, default: null },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      required: true,
      default: "draft",
    },
    language: { type: String, default: null },
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

recipeSchema.index({ created_by: 1 });
recipeSchema.index({ status: 1 });
recipeSchema.index({ difficulty: 1 });

module.exports = mongoose.model("Recipe", recipeSchema);
