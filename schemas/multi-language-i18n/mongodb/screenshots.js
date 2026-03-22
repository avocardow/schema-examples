// screenshots: Uploaded images that provide visual context for translation keys.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const screenshotsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    file_path: { type: String, required: true },
    file_size: { type: Number },
    mime_type: { type: String },
    width: { type: Number },
    height: { type: Number },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Screenshot", screenshotsSchema);
