// locale_settings: Regional formatting preferences per locale (date, time, number, currency).
// See README.md for full design rationale.

const mongoose = require("mongoose");

const localeSettingsSchema = new mongoose.Schema(
  {
    locale_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locale", required: true, unique: true },
    date_format: { type: String },
    time_format: { type: String },
    number_format: { type: String },
    currency_code: { type: String },
    currency_symbol: { type: String },
    first_day_of_week: { type: Number, required: true, default: 1 },
    measurement_system: { type: String },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("LocaleSetting", localeSettingsSchema);
