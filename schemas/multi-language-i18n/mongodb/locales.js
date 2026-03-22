// locales: Supported language/region definitions with directionality and plural rules.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const localesSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    native_name: { type: String },
    text_direction: {
      type: String,
      enum: ["ltr", "rtl"],
      required: true,
      default: "ltr",
    },
    script: { type: String },
    plural_rule: { type: String },
    plural_forms: { type: Number, required: true, default: 2 },
    is_default: { type: Boolean, required: true, default: false },
    is_enabled: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

localesSchema.index({ is_enabled: 1 });

module.exports = mongoose.model("Locale", localesSchema);
