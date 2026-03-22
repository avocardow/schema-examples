// screenshot_key_links: Maps translation keys to bounding-box regions within screenshots.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const screenshotKeyLinksSchema = new mongoose.Schema(
  {
    screenshot_id: { type: mongoose.Schema.Types.ObjectId, ref: "Screenshot", required: true },
    translation_key_id: { type: mongoose.Schema.Types.ObjectId, ref: "TranslationKey", required: true },
    x: { type: Number },
    y: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

screenshotKeyLinksSchema.index({ screenshot_id: 1, translation_key_id: 1 }, { unique: true });
screenshotKeyLinksSchema.index({ translation_key_id: 1 });

module.exports = mongoose.model("ScreenshotKeyLink", screenshotKeyLinksSchema);
