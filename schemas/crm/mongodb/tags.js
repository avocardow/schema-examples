// tags: Reusable labels for categorizing contacts, companies, and deals.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    color: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("Tag", tagsSchema);
