// events: Append-only log of all tracked user and system events.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema(
  {
    event_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EventType", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    anonymous_id: { type: String, default: null },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },
    timestamp: { type: Date, required: true },
    ip_address: { type: String, default: null },
    user_agent: { type: String, default: null },
    device_type: { type: String, default: null },
    os: { type: String, default: null },
    browser: { type: String, default: null },
    country: { type: String, default: null },
    region: { type: String, default: null },
    city: { type: String, default: null },
    locale: { type: String, default: null },
    referrer: { type: String, default: null },
    campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", default: null },
    properties: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

eventsSchema.index({ event_type_id: 1 });
eventsSchema.index({ user_id: 1, timestamp: 1 });
eventsSchema.index({ session_id: 1 });
eventsSchema.index({ timestamp: 1 });
eventsSchema.index({ campaign_id: 1 });
eventsSchema.index({ anonymous_id: 1 });
eventsSchema.index({ country: 1 });

module.exports = mongoose.model("Event", eventsSchema);
