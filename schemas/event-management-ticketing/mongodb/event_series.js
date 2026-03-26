// event_series: Groups of recurring or related events.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventSeriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    recurrence_rule: { type: String, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

eventSeriesSchema.index({ created_by: 1 });

module.exports = mongoose.model("EventSeries", eventSeriesSchema);
