// tags: Labels for categorizing recipes by cuisine, diet, or theme.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

module.exports = mongoose.model("Tag", tagSchema);
