// machine_translation_configs: Configuration for external machine translation engines.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const machineTranslationConfigsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    engine: { type: String, required: true },
    is_enabled: { type: Boolean, required: true, default: true },
    is_default: { type: Boolean, required: true, default: false },
    api_key_ref: { type: String },
    endpoint_url: { type: String },
    supported_locales: { type: mongoose.Schema.Types.Mixed },
    default_quality_score: { type: Number },
    rate_limit: { type: Number },
    options: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("MachineTranslationConfig", machineTranslationConfigsSchema);
