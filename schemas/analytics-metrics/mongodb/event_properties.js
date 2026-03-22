// event_properties: Key-value property pairs attached to individual events.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventPropertiesSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

eventPropertiesSchema.index({ event_id: 1, key: 1 }, { unique: true });
eventPropertiesSchema.index({ key: 1, value: 1 });

module.exports = mongoose.model("EventProperty", eventPropertiesSchema);
