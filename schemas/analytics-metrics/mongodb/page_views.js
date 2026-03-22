// page_views: Individual page view records with URL, viewport, and duration data.
// See README.md for full design rationale.

const mongoose = require("mongoose");

const pageViewsSchema = new mongoose.Schema(
  {
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    anonymous_id: { type: String, default: null },
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session", default: null },
    url: { type: String, required: true },
    path: { type: String, required: true },
    title: { type: String, default: null },
    referrer: { type: String, default: null },
    hostname: { type: String, required: true },
    viewport_width: { type: Number, default: null },
    viewport_height: { type: Number, default: null },
    screen_width: { type: Number, default: null },
    screen_height: { type: Number, default: null },
    duration: { type: Number, default: null },
    timestamp: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

pageViewsSchema.index({ user_id: 1, timestamp: 1 });
pageViewsSchema.index({ session_id: 1 });
pageViewsSchema.index({ path: 1 });
pageViewsSchema.index({ hostname: 1, path: 1 });
pageViewsSchema.index({ timestamp: 1 });
pageViewsSchema.index({ anonymous_id: 1 });

module.exports = mongoose.model("PageView", pageViewsSchema);
