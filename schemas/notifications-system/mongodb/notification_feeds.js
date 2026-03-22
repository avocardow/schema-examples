// notification_feeds: Named UI surfaces where notifications can appear (e.g., bell icon, activity tab, announcements banner).
// See README.md for full design rationale and field documentation.

const mongoose = require("mongoose");

const notificationFeedsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Display name (e.g., "General", "Activity", "Announcements").
    slug: { type: String, unique: true, required: true }, // URL-safe identifier used in API calls: GET /feeds/general.
    description: { type: String }, // Explain what this feed is for. Shown in admin UI.
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("NotificationFeed", notificationFeedsSchema);
