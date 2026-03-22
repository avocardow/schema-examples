// sessions: Visitor sessions aggregating page views and events with geo and device context.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const sessionsSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    anonymous_id: { type: String, default: null },
    started_at: { type: Date, required: true },
    ended_at: { type: Date, default: null },
    duration: { type: Number, default: null },
    page_count: { type: Number, required: true, default: 0 },
    event_count: { type: Number, required: true, default: 0 },
    is_bounce: { type: Boolean, required: true, default: true },
    entry_url: { type: String, default: null },
    exit_url: { type: String, default: null },
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

sessionsSchema.index({ user_id: 1, started_at: 1 });
sessionsSchema.index({ anonymous_id: 1 });
sessionsSchema.index({ started_at: 1 });
sessionsSchema.index({ campaign_id: 1 });
sessionsSchema.index({ country: 1 });
sessionsSchema.index({ is_bounce: 1 });

module.exports = mongoose.model("Session", sessionsSchema);
